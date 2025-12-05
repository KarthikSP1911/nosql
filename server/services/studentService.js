const { getDriver } = require('../config/neo4j');
const { v4: uuidv4 } = require('uuid');

class StudentService {
  /**
   * Get all students with their enrolled courses
   */
  static async getAllStudents() {
    const session = getDriver().session();
    try {
      const result = await session.run(`
        MATCH (s:Student)
        OPTIONAL MATCH (s)-[:ENROLLED_IN]->(c:Course)
        RETURN s, 
          collect(DISTINCT {
            _id: c.id,
            id: c.id,
            name: c.name, 
            code: c.code
          }) as enrolledCourses
        ORDER BY s.createdAt DESC
      `);

      return result.records.map(record => {
        const student = record.get('s').properties;
        const courses = record.get('enrolledCourses').filter(c => c._id !== null);
        
        return {
          _id: student.id,
          id: student.id,
          name: student.name,
          email: student.email,
          phone: student.phone || '',
          enrolledCourses: courses,
          createdAt: student.createdAt,
          updatedAt: student.updatedAt,
        };
      });
    } finally {
      await session.close();
    }
  }

  /**
   * Get single student by ID
   */
  static async getStudentById(id) {
    const session = getDriver().session();
    try {
      const result = await session.run(
        `
        MATCH (s:Student {id: $id})
        OPTIONAL MATCH (s)-[:ENROLLED_IN]->(c:Course)
        RETURN s, 
          collect(DISTINCT {
            _id: c.id,
            id: c.id,
            name: c.name, 
            code: c.code
          }) as enrolledCourses
        `,
        { id }
      );

      if (result.records.length === 0) {
        return null;
      }

      const record = result.records[0];
      const student = record.get('s').properties;
      const courses = record.get('enrolledCourses').filter(c => c._id !== null);

      return {
        _id: student.id,
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone || '',
        enrolledCourses: courses,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
      };
    } finally {
      await session.close();
    }
  }

  /**
   * Create a new student
   */
  static async createStudent(data) {
    const session = getDriver().session();
    try {
      const id = uuidv4();
      const now = new Date().toISOString();

      const result = await session.run(
        `
        CREATE (s:Student {
          id: $id,
          name: $name,
          email: $email,
          phone: $phone,
          createdAt: datetime($now),
          updatedAt: datetime($now)
        })
        RETURN s
        `,
        {
          id,
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          now,
        }
      );

      const student = result.records[0].get('s').properties;
      return {
        _id: student.id,
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        enrolledCourses: [],
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
      };
    } finally {
      await session.close();
    }
  }

  /**
   * Update student
   */
  static async updateStudent(id, data) {
    const session = getDriver().session();
    try {
      const now = new Date().toISOString();
      const updateFields = [];
      const params = { id, now };

      if (data.name !== undefined) {
        updateFields.push('s.name = $name');
        params.name = data.name;
      }
      if (data.email !== undefined) {
        updateFields.push('s.email = $email');
        params.email = data.email;
      }
      if (data.phone !== undefined) {
        updateFields.push('s.phone = $phone');
        params.phone = data.phone;
      }

      updateFields.push('s.updatedAt = datetime($now)');

      const result = await session.run(
        `
        MATCH (s:Student {id: $id})
        SET ${updateFields.join(', ')}
        RETURN s
        `,
        params
      );

      if (result.records.length === 0) {
        return null;
      }

      const student = result.records[0].get('s').properties;
      return {
        _id: student.id,
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
      };
    } finally {
      await session.close();
    }
  }

  /**
   * Delete student
   */
  static async deleteStudent(id) {
    const session = getDriver().session();
    try {
      const result = await session.run(
        `
        MATCH (s:Student {id: $id})
        DETACH DELETE s
        RETURN count(s) as deleted
        `,
        { id }
      );

      return result.records[0].get('deleted').toNumber() > 0;
    } finally {
      await session.close();
    }
  }

  /**
   * Enroll student in a course
   */
  static async enrollStudent(studentId, courseId) {
    const session = getDriver().session();
    try {
      const now = new Date().toISOString();

      const result = await session.run(
        `
        MATCH (s:Student {id: $studentId})
        MATCH (c:Course {id: $courseId})
        MERGE (s)-[r:ENROLLED_IN]->(c)
        ON CREATE SET r.enrolledAt = datetime($now)
        RETURN s, c
        `,
        { studentId, courseId, now }
      );

      if (result.records.length === 0) {
        return null;
      }

      // Return updated student with courses
      return await this.getStudentById(studentId);
    } finally {
      await session.close();
    }
  }

  /**
   * Check if email exists
   */
  static async emailExists(email, excludeId = null) {
    const session = getDriver().session();
    try {
      const query = excludeId
        ? `MATCH (s:Student {email: $email}) WHERE s.id <> $excludeId RETURN count(s) as count`
        : `MATCH (s:Student {email: $email}) RETURN count(s) as count`;

      const result = await session.run(query, { email, excludeId });
      return result.records[0].get('count').toNumber() > 0;
    } finally {
      await session.close();
    }
  }
}

module.exports = StudentService;
