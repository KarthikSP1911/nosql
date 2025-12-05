const express = require('express');
const router = express.Router();
const {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    enrollStudent,
} = require('../controllers/studentController.neo4j');

router.route('/').get(getStudents).post(createStudent);
router.route('/:id').get(getStudent).put(updateStudent).delete(deleteStudent);
router.route('/:id/enroll').post(enrollStudent);

module.exports = router;
