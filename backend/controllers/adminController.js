const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Course = require('../models/Course');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Enrollment = require('../models/Enrollment');
const Lesson = require('../models/Lesson');

// @desc  Get dashboard statistics
// @route GET /api/admin/stats
// @access Private (admin)
const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalStudents, totalMentors, totalCourses, totalPosts, totalEnrollments] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'mentor' }),
      Course.countDocuments(),
      Post.countDocuments(),
      Enrollment.countDocuments(),
    ]);

  const usersByRole = [
    { role: 'student', count: totalStudents },
    { role: 'mentor', count: totalMentors },
    { role: 'admin', count: totalUsers - totalStudents - totalMentors },
  ];

  const coursesByCategory = await Course.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $project: { category: '$_id', count: 1, _id: 0 } },
  ]);

  res.json({
    success: true,
    stats: { totalUsers, totalStudents, totalMentors, totalCourses, totalPosts, totalEnrollments },
    usersByRole,
    coursesByCategory,
  });
});

// @desc  Get all users
// @route GET /api/admin/users
// @access Private (admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort('-createdAt');
  res.json({ success: true, count: users.length, users });
});

// @desc  Update a user's role or active status
// @route PUT /api/admin/users/:id
// @access Private (admin)
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (req.body.role) user.role = req.body.role;
  if (typeof req.body.isActive === 'boolean') user.isActive = req.body.isActive;
  await user.save();
  res.json({ success: true, user });
});

// @desc  Delete a user
// @route DELETE /api/admin/users/:id
// @access Private (admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot delete your own admin account');
  }
  await Enrollment.deleteMany({ student: user._id });
  await user.deleteOne();
  res.json({ success: true, message: 'User deleted successfully' });
});

// @desc  Delete any course (admin override)
// @route DELETE /api/admin/courses/:id
// @access Private (admin)
const adminDeleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  await Lesson.deleteMany({ course: course._id });
  await Enrollment.deleteMany({ course: course._id });
  await course.deleteOne();
  res.json({ success: true, message: 'Course deleted successfully' });
});

// @desc  Delete any post (admin override)
// @route DELETE /api/admin/posts/:id
// @access Private (admin)
const adminDeletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();
  res.json({ success: true, message: 'Post deleted successfully' });
});

// @desc  Get all mentors (with optional approval filter)
// @route GET /api/admin/mentors
// @access Private (admin)
const getMentors = asyncHandler(async (req, res) => {
  const mentors = await User.find({ role: 'mentor' }).sort('-createdAt');
  res.json({ success: true, count: mentors.length, mentors });
});

// @desc  Approve or reject a mentor
// @route PUT /api/admin/mentors/:id/approve
// @access Private (admin)
const approveMentor = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.role !== 'mentor') {
    res.status(400);
    throw new Error('User is not a mentor');
  }
  const approved = req.body.approved !== false;
  // Use isActive to represent approval status for mentors
  user.isActive = approved;
  await user.save();
  res.json({
    success: true,
    message: `Mentor ${approved ? 'approved' : 'rejected'} successfully`,
    user,
  });
});

module.exports = { getStats, getAllUsers, updateUser, deleteUser, adminDeleteCourse, adminDeletePost, getMentors, approveMentor };
