const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', protect, authorize('mentor', 'admin'), createCourse);
router.put('/:id', protect, authorize('mentor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('mentor', 'admin'), deleteCourse);
router.post('/:id/lessons', protect, authorize('mentor', 'admin'), addLesson);

module.exports = router;
