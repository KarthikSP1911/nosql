const express = require('express');
const router = express.Router();
const {
    getFaculty,
    getSingleFaculty,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    assignFaculty,
} = require('../controllers/facultyController');

router.route('/').get(getFaculty).post(createFaculty);
router.route('/:id').get(getSingleFaculty).put(updateFaculty).delete(deleteFaculty);
router.route('/:id/assign').post(assignFaculty);

module.exports = router;
