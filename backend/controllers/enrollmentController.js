const asyncHandler = require('express-async-handler');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Notification = require('../models/Notification');

// @desc  Enroll in a course
// @route POST /api/enrollments/:courseId
// @access Private (student)
const enrollInCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const existing = await Enrollment.findOne({ student: req.user._id, course: course._id });
  if (existing) {
    res.status(400);
    throw new Error('Already enrolled in this course');
  }

  const enrollment = await Enrollment.create({ student: req.user._id, course: course._id });

  await Notification.create({
    user: req.user._id,
    type: 'enrollment',
    message: `You enrolled in "${course.title}"`,
    link: `/courses/${course._id}`,
  });

  res.status(201).json({ success: true, enrollment });
});

// @desc  Get logged-in user's enrollments
// @route GET /api/enrollments/my
// @access Private
const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate('course')
    .sort('-createdAt');
  res.json({ success: true, count: enrollments.length, enrollments });
});

// @desc  Mark a lesson complete / toggle
// @route PUT /api/enrollments/:courseId/lessons/:lessonId
// @access Private (student)
const markLessonComplete = asyncHandler(async (req, res) => {
  const { courseId, lessonId } = req.params;

  const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found. Enroll in the course first.');
  }

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  const alreadyDone = enrollment.completedLessons.some((l) => l.toString() === lessonId);
  if (alreadyDone) {
    enrollment.completedLessons = enrollment.completedLessons.filter((l) => l.toString() !== lessonId);
  } else {
    enrollment.completedLessons.push(lessonId);
  }

  const totalLessons = await Lesson.countDocuments({ course: courseId });
  enrollment.progress = totalLessons > 0 ? Math.round((enrollment.completedLessons.length / totalLessons) * 100) : 0;
  enrollment.status = enrollment.progress === 100 ? 'completed' : 'in-progress';

  await enrollment.save();
  res.json({ success: true, enrollment });
});

module.exports = { enrollInCourse, getMyEnrollments, markLessonComplete };
