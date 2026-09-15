const asyncHandler = require('express-async-handler');
const Resume = require('../models/Resume');

// @desc  Get logged-in user's resume
// @route GET /api/resumes/my
// @access Private
const getMyResume = asyncHandler(async (req, res) => {
  let resume = await Resume.findOne({ user: req.user._id });
  if (!resume) {
    resume = await Resume.create({
      user: req.user._id,
      fullName: req.user.name,
      email: req.user.email,
    });
  }
  res.json({ success: true, resume });
});

// @desc  Create or update resume (upsert)
// @route PUT /api/resumes/my
// @access Private
const saveResume = asyncHandler(async (req, res) => {
  const updates = req.body;
  const resume = await Resume.findOneAndUpdate(
    { user: req.user._id },
    { ...updates, user: req.user._id },
    { new: true, upsert: true, runValidators: true }
  );
  res.json({ success: true, resume });
});

module.exports = { getMyResume, saveResume };
