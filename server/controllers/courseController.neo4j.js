const asyncHandler = require('express-async-handler');
const CourseService = require('../services/courseService');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
    const courses = await CourseService.getAllCourses();
    res.status(200).json(courses);
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = asyncHandler(async (req, res) => {
    const course = await CourseService.getCourseById(req.params.id);
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

    // Check if code already exists
    const codeExists = await CourseService.codeExists(code);
    if (codeExists) {
        res.status(400);
        throw new Error('Course code already exists');
    }

    const course = await CourseService.createCourse({
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
    const course = await CourseService.getCourseById(req.params.id);
    
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    // Check if code is being changed and if it already exists
    if (req.body.code && req.body.code !== course.code) {
        const codeExists = await CourseService.codeExists(req.body.code, req.params.id);
        if (codeExists) {
            res.status(400);
            throw new Error('Course code already exists');
        }
    }

    const updatedCourse = await CourseService.updateCourse(req.params.id, req.body);
    res.status(200).json(updatedCourse);
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Public
const deleteCourse = asyncHandler(async (req, res) => {
    const course = await CourseService.getCourseById(req.params.id);
    
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    await CourseService.deleteCourse(req.params.id);
    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
};
