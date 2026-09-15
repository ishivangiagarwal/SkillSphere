const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

// @desc  Get all published courses (with optional search/filter)
// @route GET /api/courses
// @access Public
const getCourses = asyncHandler(async (req, res) => {
  const { search, category, level } = req.query;
  const query = { isPublished: true };

  if (search) query.title = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  if (level) query.level = level;

  const courses = await Course.find(query).populate('instructor', 'name avatar').sort('-createdAt');
  res.json({ success: true, count: courses.length, courses });
});

// @desc  Get single course with lessons
// @route GET /api/courses/:id
// @access Public
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate('instructor', 'name avatar bio');
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  const lessons = await Lesson.find({ course: course._id }).sort('order');
  res.json({ success: true, course, lessons });
});

// @desc  Create course
// @route POST /api/courses
// @access Private (mentor, admin)
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category, level, thumbnail, tags, duration } = req.body;

  if (!title || !description || !category) {
    res.status(400);
    throw new Error('Title, description and category are required');
  }

  const course = await Course.create({
    title,
    description,
    category,
    level,
    thumbnail,
    tags,
    duration,
    instructor: req.user._id,
  });

  res.status(201).json({ success: true, course });
});

// @desc  Update course
// @route PUT /api/courses/:id
// @access Private (owner mentor, admin)
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this course');
  }

  Object.assign(course, req.body);
  const updated = await course.save();
  res.json({ success: true, course: updated });
});

// @desc  Delete course
// @route DELETE /api/courses/:id
// @access Private (owner mentor, admin)
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this course');
  }

  await Lesson.deleteMany({ course: course._id });
  await Enrollment.deleteMany({ course: course._id });
  await course.deleteOne();

  res.json({ success: true, message: 'Course deleted successfully' });
});

// @desc  Add lesson to course
// @route POST /api/courses/:id/lessons
// @access Private (owner mentor, admin)
const addLesson = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to add lessons to this course');
  }

  const { title, content, videoUrl, order, duration } = req.body;
  const lesson = await Lesson.create({
    course: course._id,
    title,
    content,
    videoUrl,
    order,
    duration,
  });

  res.status(201).json({ success: true, lesson });
});

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
};
