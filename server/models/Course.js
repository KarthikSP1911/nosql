const mongoose = require('mongoose');

const courseSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a course name'],
        },
        code: {
            type: String,
            required: [true, 'Please add a course code'],
            unique: true,
        },
        credits: {
            type: Number,
            required: [true, 'Please add credits'],
        },
        facultyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Faculty',
        },
        enrolledStudents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Student',
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Course', courseSchema);
