const express = require('express');
const router = express.Router();
const {
  getMentorDashboard,
  getCourseStudents,
  getMentorCourses,
} = require('../controllers/mentorController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('mentor', 'admin'));

router.get('/dashboard', getMentorDashboard);
router.get('/courses', getMentorCourses);
router.get('/courses/:courseId/students', getCourseStudents);

module.exports = router;

