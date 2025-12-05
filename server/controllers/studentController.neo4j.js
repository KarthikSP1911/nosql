const asyncHandler = require('express-async-handler');
const StudentService = require('../services/studentService');
const CourseService = require('../services/courseService');

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getStudents = asyncHandler(async (req, res) => {
    const students = await StudentService.getAllStudents();
    res.status(200).json(students);
});

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Public
const getStudent = asyncHandler(async (req, res) => {
    const student = await StudentService.getStudentById(req.params.id);
    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }
    res.status(200).json(student);
});

// @desc    Create student
// @route   POST /api/students
// @access  Public
const createStudent = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;
    
    if (!name || !email) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Check if email already exists
    const emailExists = await StudentService.emailExists(email);
    if (emailExists) {
        res.status(400);
        throw new Error('Email already exists');
    }

    const student = await StudentService.createStudent({
        name,
        email,
        phone: phone || '',
    });
    
    res.status(201).json(student);
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Public
const updateStudent = asyncHandler(async (req, res) => {
    const student = await StudentService.getStudentById(req.params.id);
    
    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    // Check if email is being changed and if it already exists
    if (req.body.email && req.body.email !== student.email) {
        const emailExists = await StudentService.emailExists(req.body.email, req.params.id);
        if (emailExists) {
            res.status(400);
            throw new Error('Email already exists');
        }
    }

    const updatedStudent = await StudentService.updateStudent(req.params.id, req.body);
    res.status(200).json(updatedStudent);
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Public
const deleteStudent = asyncHandler(async (req, res) => {
    const student = await StudentService.getStudentById(req.params.id);
    
    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    await StudentService.deleteStudent(req.params.id);
    res.status(200).json({ id: req.params.id });
});

// @desc    Enroll student in a course
// @route   POST /api/students/:id/enroll
// @access  Public
const enrollStudent = asyncHandler(async (req, res) => {
    const { courseId } = req.body;
    
    const student = await StudentService.getStudentById(req.params.id);
    const course = await CourseService.getCourseById(courseId);

    if (!student || !course) {
        res.status(404);
        throw new Error('Student or Course not found');
    }

    const updatedStudent = await StudentService.enrollStudent(req.params.id, courseId);
    res.status(200).json(updatedStudent);
});

module.exports = {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    enrollStudent,
};
