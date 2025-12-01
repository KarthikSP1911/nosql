const mongoose = require('mongoose');

const facultySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
        },
        department: {
            type: String,
            required: [true, 'Please add a department'],
        },
        assignedCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course',
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Faculty', facultySchema);
