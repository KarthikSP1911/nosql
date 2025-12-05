const asyncHandler = require('express-async-handler');
const FacultyService = require('../services/facultyService');
const CourseService = require('../services/courseService');

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Public
const getFaculty = asyncHandler(async (req, res) => {
    const faculty = await FacultyService.getAllFaculty();
    res.status(200).json(faculty);
});

// @desc    Get single faculty
// @route   GET /api/faculty/:id
// @access  Public
const getSingleFaculty = asyncHandler(async (req, res) => {
    const faculty = await FacultyService.getFacultyById(req.params.id);
    if (!faculty) {
        res.status(404);
        throw new Error('Faculty not found');
    }
    res.status(200).json(faculty);
});

// @desc    Create faculty
// @route   POST /api/faculty
// @access  Public
const createFaculty = asyncHandler(async (req, res) => {
    const { name, email, department } = req.body;
    
    if (!name || !email || !department) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Check if email already exists
    const emailExists = await FacultyService.emailExists(email);
    if (emailExists) {
        res.status(400);
        throw new Error('Email already exists');
    }

    const faculty = await FacultyService.createFaculty({
        name,
        email,
        department,
    });
    
    res.status(201).json(faculty);
});

// @desc    Update faculty
// @route   PUT /api/faculty/:id
// @access  Public
const updateFaculty = asyncHandler(async (req, res) => {
    const faculty = await FacultyService.getFacultyById(req.params.id);
    
    if (!faculty) {
        res.status(404);
        throw new Error('Faculty not found');
    }

    // Check if email is being changed and if it already exists
    if (req.body.email && req.body.email !== faculty.email) {
        const emailExists = await FacultyService.emailExists(req.body.email, req.params.id);
        if (emailExists) {
            res.status(400);
            throw new Error('Email already exists');
        }
    }

    const updatedFaculty = await FacultyService.updateFaculty(req.params.id, req.body);
    res.status(200).json(updatedFaculty);
});

// @desc    Delete faculty
// @route   DELETE /api/faculty/:id
// @access  Public
const deleteFaculty = asyncHandler(async (req, res) => {
    const faculty = await FacultyService.getFacultyById(req.params.id);
    
    if (!faculty) {
        res.status(404);
        throw new Error('Faculty not found');
    }

    await FacultyService.deleteFaculty(req.params.id);
    res.status(200).json({ id: req.params.id });
});

// @desc    Assign faculty to a course
// @route   POST /api/faculty/:id/assign
// @access  Public
const assignFaculty = asyncHandler(async (req, res) => {
    const { courseId } = req.body;
    
    const faculty = await FacultyService.getFacultyById(req.params.id);
    const course = await CourseService.getCourseById(courseId);

    if (!faculty || !course) {
        res.status(404);
        throw new Error('Faculty or Course not found');
    }

    const updatedFaculty = await FacultyService.assignFaculty(req.params.id, courseId);
    res.status(200).json(updatedFaculty);
});

module.exports = {
    getFaculty,
    getSingleFaculty,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    assignFaculty,
};
