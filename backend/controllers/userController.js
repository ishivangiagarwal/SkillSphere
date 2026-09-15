const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

// @desc  Get user profile by id
// @route GET /api/users/:id
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ success: true, user });
});

// @desc  Update logged-in user's profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name ?? user.name;
  user.bio = req.body.bio ?? user.bio;
  user.avatar = req.body.avatar ?? user.avatar;
  if (Array.isArray(req.body.skills)) user.skills = req.body.skills;
  if (req.body.socialLinks) {
    user.socialLinks = { ...user.socialLinks.toObject?.() ?? user.socialLinks, ...req.body.socialLinks };
  }

  const updatedUser = await user.save();
  res.json({ success: true, user: updatedUser });
});

// @desc  Get dashboard summary for logged-in user
// @route GET /api/users/dashboard
// @access Private
const getDashboardData = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate('course', 'title thumbnail category level')
    .sort('-updatedAt');

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.status === 'completed').length;
  const avgProgress =
    totalCourses > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / totalCourses)
      : 0;

  res.json({
    success: true,
    stats: {
      totalCourses,
      completedCourses,
      inProgressCourses: totalCourses - completedCourses,
      avgProgress,
    },
    recentEnrollments: enrollments.slice(0, 5),
  });
});

module.exports = { getUserProfile, updateUserProfile, getDashboardData };
