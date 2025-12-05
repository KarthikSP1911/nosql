const { getDriver } = require('../config/neo4j');
const { v4: uuidv4 } = require('uuid');

class CourseService {
  /**
   * Get all courses with faculty and enrolled students
   */
  static async getAllCourses() {
    const session = getDriver().session();
    try {
      const result = await session.run(`
        MATCH (c:Course)
        OPTIONAL MATCH (f:Faculty)-[:TEACHES]->(c)
        OPTIONAL MATCH (s:Student)-[:ENROLLED_IN]->(c)
        RETURN c, 
          {_id: f.id, id: f.id, name: f.name, email: f.email, department: f.department} as facultyId,
          collect(DISTINCT {_id: s.id, id: s.id, name: s.name, email: s.email}) as enrolledStudents
        ORDER BY c.createdAt DESC
      `);

      return result.records.map(record => {
        const course = record.get('c').properties;
        const faculty = record.get('facultyId');
        const students = record.get('enrolledStudents').filter(s => s._id !== null);
        
        return {
          _id: course.id,
          id: course.id,
          name: course.name,
          code: course.code,
          credits: course.credits.toNumber ? course.credits.toNumber() : course.credits,
          facultyId: faculty._id ? faculty : null,
          enrolledStudents: students,
          createdAt: course.createdAt,
          updatedAt: course.updatedAt,
        };
      });
    } finally {
      await session.close();
    }
  }

  /**
   * Get single course by ID
   */
  static async getCourseById(id) {
    const session = getDriver().session();
    try {
      const result = await session.run(
        `
        MATCH (c:Course {id: $id})
        OPTIONAL MATCH (f:Faculty)-[:TEACHES]->(c)
        OPTIONAL MATCH (s:Student)-[:ENROLLED_IN]->(c)
        RETURN c, 
          {_id: f.id, id: f.id, name: f.name, email: f.email, department: f.department} as facultyId,
          collect(DISTINCT {_id: s.id, id: s.id, name: s.name, email: s.email}) as enrolledStudents
        `,
        { id }
      );

      if (result.records.length === 0) {
        return null;
      }

      const record = result.records[0];
      const course = record.get('c').properties;
      const faculty = record.get('facultyId');
      const students = record.get('enrolledStudents').filter(s => s._id !== null);

      return {
        _id: course.id,
        id: course.id,
        name: course.name,
        code: course.code,
        credits: course.credits.toNumber ? course.credits.toNumber() : course.credits,
        facultyId: faculty._id ? faculty : null,
        enrolledStudents: students,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      };
    } finally {
      await session.close();
    }
  }

  /**
   * Create a new course
   */
  static async createCourse(data) {
    const session = getDriver().session();
    try {
      const id = uuidv4();
      const now = new Date().toISOString();

      const result = await session.run(
        `
        CREATE (c:Course {
          id: $id,
          name: $name,
          code: $code,
          credits: $credits,
          createdAt: datetime($now),
          updatedAt: datetime($now)
        })
        RETURN c
        `,
        {
          id,
          name: data.name,
          code: data.code,
          credits: parseInt(data.credits),
          now,
        }
      );

      const course = result.records[0].get('c').properties;
      return {
        _id: course.id,
        id: course.id,
        name: course.name,
        code: course.code,
        credits: course.credits.toNumber ? course.credits.toNumber() : course.credits,
        facultyId: null,
        enrolledStudents: [],
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      };
    } finally {
      await session.close();
    }
  }

  /**
   * Update course
   */
  static async updateCourse(id, data) {
    const session = getDriver().session();
    try {
      const now = new Date().toISOString();
      const updateFields = [];
      const params = { id, now };

      if (data.name !== undefined) {
        updateFields.push('c.name = $name');
        params.name = data.name;
      }
      if (data.code !== undefined) {
        updateFields.push('c.code = $code');
        params.code = data.code;
      }
      if (data.credits !== undefined) {
        updateFields.push('c.credits = $credits');
        params.credits = parseInt(data.credits);
      }

      updateFields.push('c.updatedAt = datetime($now)');

      const result = await session.run(
        `
        MATCH (c:Course {id: $id})
        SET ${updateFields.join(', ')}
        RETURN c
        `,
        params
      );

      if (result.records.length === 0) {
        return null;
      }

      const course = result.records[0].get('c').properties;
      return {
        _id: course.id,
        id: course.id,
        name: course.name,
        code: course.code,
        credits: course.credits.toNumber ? course.credits.toNumber() : course.credits,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      };
    } finally {
      await session.close();
    }
  }

  /**
   * Delete course
   */
  static async deleteCourse(id) {
    const session = getDriver().session();
    try {
      const result = await session.run(
        `
        MATCH (c:Course {id: $id})
        DETACH DELETE c
        RETURN count(c) as deleted
        `,
        { id }
      );

      return result.records[0].get('deleted').toNumber() > 0;
    } finally {
      await session.close();
    }
  }

  /**
   * Check if code exists
   */
  static async codeExists(code, excludeId = null) {
    const session = getDriver().session();
    try {
      const query = excludeId
        ? `MATCH (c:Course {code: $code}) WHERE c.id <> $excludeId RETURN count(c) as count`
        : `MATCH (c:Course {code: $code}) RETURN count(c) as count`;

      const result = await session.run(query, { code, excludeId });
      return result.records[0].get('count').toNumber() > 0;
    } finally {
      await session.close();
    }
  }
}

module.exports = CourseService;
