const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getMyEnrollments,
  markLessonComplete,
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/auth');

router.get('/my', protect, getMyEnrollments);
router.post('/:courseId', protect, enrollInCourse);
router.put('/:courseId/lessons/:lessonId', protect, markLessonComplete);

module.exports = router;
