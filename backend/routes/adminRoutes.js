const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  updateUser,
  deleteUser,
  adminDeleteCourse,
  adminDeletePost,
  getMentors,
  approveMentor,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.delete('/courses/:id', adminDeleteCourse);
router.delete('/posts/:id', adminDeletePost);
router.get('/mentors', getMentors);
router.put('/mentors/:id/approve', approveMentor);

module.exports = router;
