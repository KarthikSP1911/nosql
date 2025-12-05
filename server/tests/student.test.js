const StudentService = require('../services/studentService');
const CourseService = require('../services/courseService');
const { connectNeo4j, closeConnection } = require('../config/neo4j');

beforeAll(async () => {
  await connectNeo4j();
});

afterAll(async () => {
  await closeConnection();
});

describe('Student Service Tests', () => {
  let testStudent;
  let testCourse;

  beforeEach(async () => {
    // Create test course
    testCourse = await CourseService.createCourse({
      name: 'Test Course',
      code: 'TEST101',
      credits: 3,
    });
  });

  afterEach(async () => {
    // Cleanup
    if (testStudent) {
      await StudentService.deleteStudent(testStudent.id);
    }
    if (testCourse) {
      await CourseService.deleteCourse(testCourse.id);
    }
  });

  test('should create a new student', async () => {
    const studentData = {
      name: 'John Doe',
      email: 'john.doe@test.com',
      phone: '1234567890',
    };

    testStudent = await StudentService.createStudent(studentData);

    expect(testStudent).toBeDefined();
    expect(testStudent.name).toBe(studentData.name);
    expect(testStudent.email).toBe(studentData.email);
    expect(testStudent.phone).toBe(studentData.phone);
    expect(testStudent.id).toBeDefined();
  });

  test('should get student by ID', async () => {
    testStudent = await StudentService.createStudent({
      name: 'Jane Doe',
      email: 'jane.doe@test.com',
      phone: '0987654321',
    });

    const retrieved = await StudentService.getStudentById(testStudent.id);

    expect(retrieved).toBeDefined();
    expect(retrieved.id).toBe(testStudent.id);
    expect(retrieved.name).toBe(testStudent.name);
  });

  test('should update student', async () => {
    testStudent = await StudentService.createStudent({
      name: 'Update Test',
      email: 'update@test.com',
      phone: '1111111111',
    });

    const updated = await StudentService.updateStudent(testStudent.id, {
      name: 'Updated Name',
      phone: '2222222222',
    });

    expect(updated.name).toBe('Updated Name');
    expect(updated.phone).toBe('2222222222');
    expect(updated.email).toBe('update@test.com');
  });

  test('should delete student', async () => {
    testStudent = await StudentService.createStudent({
      name: 'Delete Test',
      email: 'delete@test.com',
      phone: '3333333333',
    });

    const deleted = await StudentService.deleteStudent(testStudent.id);
    expect(deleted).toBe(true);

    const retrieved = await StudentService.getStudentById(testStudent.id);
    expect(retrieved).toBeNull();

    testStudent = null; // Prevent cleanup error
  });

  test('should enroll student in course', async () => {
    testStudent = await StudentService.createStudent({
      name: 'Enroll Test',
      email: 'enroll@test.com',
      phone: '4444444444',
    });

    const enrolled = await StudentService.enrollStudent(testStudent.id, testCourse.id);

    expect(enrolled).toBeDefined();
    expect(enrolled.enrolledCourses).toBeDefined();
    expect(enrolled.enrolledCourses.length).toBeGreaterThan(0);
    expect(enrolled.enrolledCourses[0].code).toBe('TEST101');
  });

  test('should check if email exists', async () => {
    testStudent = await StudentService.createStudent({
      name: 'Email Test',
      email: 'emailtest@test.com',
      phone: '5555555555',
    });

    const exists = await StudentService.emailExists('emailtest@test.com');
    expect(exists).toBe(true);

    const notExists = await StudentService.emailExists('nonexistent@test.com');
    expect(notExists).toBe(false);
  });

  test('should get all students', async () => {
    testStudent = await StudentService.createStudent({
      name: 'List Test',
      email: 'list@test.com',
      phone: '6666666666',
    });

    const students = await StudentService.getAllStudents();

    expect(students).toBeDefined();
    expect(Array.isArray(students)).toBe(true);
    expect(students.length).toBeGreaterThan(0);
  });
});
