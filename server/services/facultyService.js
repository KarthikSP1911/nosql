const { getDriver } = require('../config/neo4j');
const { v4: uuidv4 } = require('uuid');

class FacultyService {
  /**
   * Get all faculty with their assigned courses
   */
  static async getAllFaculty() {
    const session = getDriver().session();
    try {
      const result = await session.run(`
        MATCH (f:Faculty)
        OPTIONAL MATCH (f)-[:TEACHES]->(c:Course)
        RETURN f, 
          collect(DISTINCT {
            _id: c.id,
            id: c.id,
            name: c.name, 
            code: c.code
          }) as assignedCourses
        ORDER BY f.createdAt DESC
      `);

      return result.records.map(record => {
        const faculty = record.get('f').properties;
        const courses = record.get('assignedCourses').filter(c => c._id !== null);
        
        return {
          _id: faculty.id,
          id: faculty.id,
          name: faculty.name,
          email: faculty.email,
          department: faculty.department,
          assignedCourses: courses,
          createdAt: faculty.createdAt,
          updatedAt: faculty.updatedAt,
        };
      });
    } finally {
      await session.close();
    }
  }

  /**
   * Get single faculty by ID
   */
  static async getFacultyById(id) {
    const session = getDriver().session();
    try {
      const result = await session.run(
        `
        MATCH (f:Faculty {id: $id})
        OPTIONAL MATCH (f)-[:TEACHES]->(c:Course)
        RETURN f, 
          collect(DISTINCT {
            _id: c.id,
            id: c.id,
            name: c.name, 
            code: c.code
          }) as assignedCourses
        `,
        { id }
      );

      if (result.records.length === 0) {
        return null;
      }

      const record = result.records[0];
      const faculty = record.get('f').properties;
      const courses = record.get('assignedCourses').filter(c => c._id !== null);

      return {
        _id: faculty.id,
        id: faculty.id,
        name: faculty.name,
        email: faculty.email,
        department: faculty.department,
        assignedCourses: courses,
        createdAt: faculty.createdAt,
        updatedAt: faculty.updatedAt,
      };
    } finally {
      await session.close();
    }
  }

  /**
   * Create a new faculty
   */
  static async createFaculty(data) {
    const session = getDriver().session();
    try {
      const id = uuidv4();
      const now = new Date().toISOString();

      const result = await session.run(
        `
        CREATE (f:Faculty {
          id: $id,
          name: $name,
          email: $email,
          department: $department,
          createdAt: datetime($now),
          updatedAt: datetime($now)
        })
        RETURN f
        `,
        {
          id,
          name: data.name,
          email: data.email,
          department: data.department,
          now,
        }
      );

      const faculty = result.records[0].get('f').properties;
      return {
        _id: faculty.id,
        id: faculty.id,
        name: faculty.name,
        email: faculty.email,
        department: faculty.department,
        assignedCourses: [],
        createdAt: faculty.createdAt,
        updatedAt: faculty.updatedAt,
      };
    } finally {
      await session.close();
    }
  }

  /**
   * Update faculty
   */
  static async updateFaculty(id, data) {
    const session = getDriver().session();
    try {
      const now = new Date().toISOString();
      const updateFields = [];
      const params = { id, now };

      if (data.name !== undefined) {
        updateFields.push('f.name = $name');
        params.name = data.name;
      }
      if (data.email !== undefined) {
        updateFields.push('f.email = $email');
        params.email = data.email;
      }
      if (data.department !== undefined) {
        updateFields.push('f.department = $department');
        params.department = data.department;
      }

      updateFields.push('f.updatedAt = datetime($now)');

      const result = await session.run(
        `
        MATCH (f:Faculty {id: $id})
        SET ${updateFields.join(', ')}
        RETURN f
        `,
        params
      );

      if (result.records.length === 0) {
        return null;
      }

      const faculty = result.records[0].get('f').properties;
      return {
        _id: faculty.id,
        id: faculty.id,
        name: faculty.name,
        email: faculty.email,
        department: faculty.department,
        createdAt: faculty.createdAt,
        updatedAt: faculty.updatedAt,
      };
    } finally {
      await session.close();
    }
  }

  /**
   * Delete faculty
   */
  static async deleteFaculty(id) {
    const session = getDriver().session();
    try {
      const result = await session.run(
        `
        MATCH (f:Faculty {id: $id})
        DETACH DELETE f
        RETURN count(f) as deleted
        `,
        { id }
      );

      return result.records[0].get('deleted').toNumber() > 0;
    } finally {
      await session.close();
    }
  }

  /**
   * Assign faculty to a course
   */
  static async assignFaculty(facultyId, courseId) {
    const session = getDriver().session();
    try {
      const now = new Date().toISOString();

      const result = await session.run(
        `
        MATCH (f:Faculty {id: $facultyId})
        MATCH (c:Course {id: $courseId})
        MERGE (f)-[r:TEACHES]->(c)
        ON CREATE SET r.assignedAt = datetime($now)
        RETURN f, c
        `,
        { facultyId, courseId, now }
      );

      if (result.records.length === 0) {
        return null;
      }

      // Return updated faculty with courses
      return await this.getFacultyById(facultyId);
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
        ? `MATCH (f:Faculty {email: $email}) WHERE f.id <> $excludeId RETURN count(f) as count`
        : `MATCH (f:Faculty {email: $email}) RETURN count(f) as count`;

      const result = await session.run(query, { email, excludeId });
      return result.records[0].get('count').toNumber() > 0;
    } finally {
      await session.close();
    }
  }
}

module.exports = FacultyService;
