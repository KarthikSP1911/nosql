const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Course = require('../models/Course');

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getStudents = asyncHandler(async (req, res) => {
    const students = await Student.find().populate('enrolledCourses', 'name code');
    res.status(200).json(students);
});

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Public
const getStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id).populate('enrolledCourses', 'name code');
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
    const student = await Student.create({
        name,
        email,
        phone,
    });
    res.status(201).json(student);
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Public
const updateStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.status(200).json(updatedStudent);
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Public
const deleteStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }
    await student.deleteOne();
    res.status(200).json({ id: req.params.id });
});

// @desc    Enroll student in a course
// @route   POST /api/students/:id/enroll
// @access  Public
const enrollStudent = asyncHandler(async (req, res) => {
    const { courseId } = req.body;
    const student = await Student.findById(req.params.id);
    const course = await Course.findById(courseId);

    if (!student || !course) {
        res.status(404);
        throw new Error('Student or Course not found');
    }

    if (!student.enrolledCourses.includes(courseId)) {
        student.enrolledCourses.push(courseId);
        await student.save();
    }

    if (!course.enrolledStudents.includes(student._id)) {
        course.enrolledStudents.push(student._id);
        await course.save();
    }

    res.status(200).json(student);
});

module.exports = {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    enrollStudent,
};
