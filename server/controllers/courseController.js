const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find()
        .populate('facultyId', 'name email')
        .populate('enrolledStudents', 'name email');
    res.status(200).json(courses);
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id)
        .populate('facultyId', 'name email')
        .populate('enrolledStudents', 'name email');
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }
    res.status(200).json(course);
});

// @desc    Create course
// @route   POST /api/courses
// @access  Public
const createCourse = asyncHandler(async (req, res) => {
    const { name, code, credits } = req.body;
    if (!name || !code || !credits) {
        res.status(400);
        throw new Error('Please add all fields');
    }
    const course = await Course.create({
        name,
        code,
        credits,
    });
    res.status(201).json(course);
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Public
const updateCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.status(200).json(updatedCourse);
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Public
const deleteCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }
    await course.deleteOne();
    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
};
