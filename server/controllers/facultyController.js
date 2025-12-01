const asyncHandler = require('express-async-handler');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Public
const getFaculty = asyncHandler(async (req, res) => {
    const faculty = await Faculty.find().populate('assignedCourses', 'name code');
    res.status(200).json(faculty);
});

// @desc    Get single faculty
// @route   GET /api/faculty/:id
// @access  Public
const getSingleFaculty = asyncHandler(async (req, res) => {
    const faculty = await Faculty.findById(req.params.id).populate('assignedCourses', 'name code');
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
    const faculty = await Faculty.create({
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
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
        res.status(404);
        throw new Error('Faculty not found');
    }
    const updatedFaculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.status(200).json(updatedFaculty);
});

// @desc    Delete faculty
// @route   DELETE /api/faculty/:id
// @access  Public
const deleteFaculty = asyncHandler(async (req, res) => {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
        res.status(404);
        throw new Error('Faculty not found');
    }
    await faculty.deleteOne();
    res.status(200).json({ id: req.params.id });
});

// @desc    Assign faculty to a course
// @route   POST /api/faculty/:id/assign
// @access  Public
const assignFaculty = asyncHandler(async (req, res) => {
    const { courseId } = req.body;
    const faculty = await Faculty.findById(req.params.id);
    const course = await Course.findById(courseId);

    if (!faculty || !course) {
        res.status(404);
        throw new Error('Faculty or Course not found');
    }

    if (!faculty.assignedCourses.includes(courseId)) {
        faculty.assignedCourses.push(courseId);
        await faculty.save();
    }

    // Update course to reflect faculty assignment
    course.facultyId = faculty._id;
    await course.save();

    res.status(200).json(faculty);
});

module.exports = {
    getFaculty,
    getSingleFaculty,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    assignFaculty,
};
