const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Routes pour les étudiants
router.post('/', studentController.createStudent);
router.get('/:id', studentController.getStudent);
router.post('/:studentId/enroll/:courseId', studentController.enrollInCourse);
router.get('/:id/courses', studentController.getEnrolledCourses);

module.exports = router;