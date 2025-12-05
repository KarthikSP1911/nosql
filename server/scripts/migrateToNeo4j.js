const mongoose = require('mongoose');
const neo4j = require('neo4j-driver');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

// MongoDB Models
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');

// Neo4j Connection
let neo4jDriver;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const connectNeo4j = () => {
  try {
    const uri = process.env.NEO4J_URI || 'neo4j://localhost:7687';
    const user = process.env.NEO4J_USER || 'neo4j';
    const password = process.env.NEO4J_PASSWORD || 'password';

    neo4jDriver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    console.log('✅ Neo4j Connected');
    return neo4jDriver;
  } catch (error) {
    console.error('❌ Neo4j Connection Error:', error.message);
    process.exit(1);
  }
};

const clearNeo4jDatabase = async () => {
  const session = neo4jDriver.session();
  try {
    console.log('🗑️  Clearing Neo4j database...');
    await session.run('MATCH (n) DETACH DELETE n');
    console.log('✅ Neo4j database cleared');
  } finally {
    await session.close();
  }
};

const createConstraints = async () => {
  const session = neo4jDriver.session();
  try {
    console.log('🔧 Creating constraints and indexes...');

    await session.run(`
      CREATE CONSTRAINT student_email_unique IF NOT EXISTS
      FOR (s:Student) REQUIRE s.email IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT faculty_email_unique IF NOT EXISTS
      FOR (f:Faculty) REQUIRE f.email IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT course_code_unique IF NOT EXISTS
      FOR (c:Course) REQUIRE c.code IS UNIQUE
    `);

    console.log('✅ Constraints created');
  } finally {
    await session.close();
  }
};

const migrateStudents = async () => {
  const session = neo4jDriver.session();
  try {
    console.log('📚 Migrating students...');
    const students = await Student.find();
    const idMapping = new Map();

    for (const student of students) {
      const newId = uuidv4();
      idMapping.set(student._id.toString(), newId);

      await session.run(
        `
        CREATE (s:Student {
          id: $id,
          name: $name,
          email: $email,
          phone: $phone,
          createdAt: datetime($createdAt),
          updatedAt: datetime($updatedAt)
        })
        `,
        {
          id: newId,
          name: student.name,
          email: student.email,
          phone: student.phone || '',
          createdAt: student.createdAt.toISOString(),
          updatedAt: student.updatedAt.toISOString(),
        }
      );
    }

    console.log(`✅ Migrated ${students.length} students`);
    return idMapping;
  } finally {
    await session.close();
  }
};

const migrateFaculty = async () => {
  const session = neo4jDriver.session();
  try {
    console.log('👨‍🏫 Migrating faculty...');
    const faculty = await Faculty.find();
    const idMapping = new Map();

    for (const fac of faculty) {
      const newId = uuidv4();
      idMapping.set(fac._id.toString(), newId);

      await session.run(
        `
        CREATE (f:Faculty {
          id: $id,
          name: $name,
          email: $email,
          department: $department,
          createdAt: datetime($createdAt),
          updatedAt: datetime($updatedAt)
        })
        `,
        {
          id: newId,
          name: fac.name,
          email: fac.email,
          department: fac.department,
          createdAt: fac.createdAt.toISOString(),
          updatedAt: fac.updatedAt.toISOString(),
        }
      );
    }

    console.log(`✅ Migrated ${faculty.length} faculty members`);
    return idMapping;
  } finally {
    await session.close();
  }
};

const migrateCourses = async () => {
  const session = neo4jDriver.session();
  try {
    console.log('📖 Migrating courses...');
    const courses = await Course.find();
    const idMapping = new Map();

    for (const course of courses) {
      const newId = uuidv4();
      idMapping.set(course._id.toString(), newId);

      await session.run(
        `
        CREATE (c:Course {
          id: $id,
          name: $name,
          code: $code,
          credits: $credits,
          createdAt: datetime($createdAt),
          updatedAt: datetime($updatedAt)
        })
        `,
        {
          id: newId,
          name: course.name,
          code: course.code,
          credits: course.credits,
          createdAt: course.createdAt.toISOString(),
          updatedAt: course.updatedAt.toISOString(),
        }
      );
    }

    console.log(`✅ Migrated ${courses.length} courses`);
    return idMapping;
  } finally {
    await session.close();
  }
};

const migrateRelationships = async (studentMap, facultyMap, courseMap) => {
  const session = neo4jDriver.session();
  try {
    console.log('🔗 Creating relationships...');
    let enrollmentCount = 0;
    let teachingCount = 0;

    // Migrate student enrollments
    const students = await Student.find().populate('enrolledCourses');
    for (const student of students) {
      const studentId = studentMap.get(student._id.toString());
      
      for (const course of student.enrolledCourses) {
        const courseId = courseMap.get(course._id.toString());
        if (studentId && courseId) {
          await session.run(
            `
            MATCH (s:Student {id: $studentId})
            MATCH (c:Course {id: $courseId})
            MERGE (s)-[r:ENROLLED_IN]->(c)
            ON CREATE SET r.enrolledAt = datetime()
            `,
            { studentId, courseId }
          );
          enrollmentCount++;
        }
      }
    }

    // Migrate faculty assignments
    const faculty = await Faculty.find().populate('assignedCourses');
    for (const fac of faculty) {
      const facultyId = facultyMap.get(fac._id.toString());
      
      for (const course of fac.assignedCourses) {
        const courseId = courseMap.get(course._id.toString());
        if (facultyId && courseId) {
          await session.run(
            `
            MATCH (f:Faculty {id: $facultyId})
            MATCH (c:Course {id: $courseId})
            MERGE (f)-[r:TEACHES]->(c)
            ON CREATE SET r.assignedAt = datetime()
            `,
            { facultyId, courseId }
          );
          teachingCount++;
        }
      }
    }

    console.log(`✅ Created ${enrollmentCount} enrollment relationships`);
    console.log(`✅ Created ${teachingCount} teaching relationships`);
  } finally {
    await session.close();
  }
};

const verifyMigration = async () => {
  const session = neo4jDriver.session();
  try {
    console.log('\n📊 Verification Report:');
    console.log('='.repeat(50));

    const studentCount = await session.run('MATCH (s:Student) RETURN count(s) as count');
    console.log(`Students: ${studentCount.records[0].get('count').toNumber()}`);

    const facultyCount = await session.run('MATCH (f:Faculty) RETURN count(f) as count');
    console.log(`Faculty: ${facultyCount.records[0].get('count').toNumber()}`);

    const courseCount = await session.run('MATCH (c:Course) RETURN count(c) as count');
    console.log(`Courses: ${courseCount.records[0].get('count').toNumber()}`);

    const enrollmentCount = await session.run('MATCH ()-[r:ENROLLED_IN]->() RETURN count(r) as count');
    console.log(`Enrollments: ${enrollmentCount.records[0].get('count').toNumber()}`);

    const teachingCount = await session.run('MATCH ()-[r:TEACHES]->() RETURN count(r) as count');
    console.log(`Teaching Assignments: ${teachingCount.records[0].get('count').toNumber()}`);

    console.log('='.repeat(50));
  } finally {
    await session.close();
  }
};

const runMigration = async () => {
  try {
    console.log('\n🚀 Starting MongoDB to Neo4j Migration\n');

    // Connect to databases
    await connectMongoDB();
    connectNeo4j();

    // Clear Neo4j database
    await clearNeo4jDatabase();

    // Create constraints
    await createConstraints();

    // Migrate data
    const studentMap = await migrateStudents();
    const facultyMap = await migrateFaculty();
    const courseMap = await migrateCourses();

    // Create relationships
    await migrateRelationships(studentMap, facultyMap, courseMap);

    // Verify migration
    await verifyMigration();

    console.log('\n✅ Migration completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    await neo4jDriver.close();
    process.exit(0);
  }
};

// Run migration
runMigration();
