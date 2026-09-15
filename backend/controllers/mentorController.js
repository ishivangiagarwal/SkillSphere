const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Lesson = require('../models/Lesson');

// @desc  Get mentor dashboard data
// @route GET /api/mentor/dashboard
// @access Private (mentor)
const getMentorDashboard = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id }).sort('-createdAt');
  const courseIds = courses.map((c) => c._id);

  const enrollments = await Enrollment.find({ course: { $in: courseIds } })
    .populate('student', 'name email avatar')
    .populate('course', 'title')
    .sort('-createdAt');

  const totalStudents = new Set(enrollments.map((e) => e.student?._id?.toString())).size;
  const totalCourses = courses.length;
  const recentEnrollments = enrollments.slice(0, 10);

  const courseStats = await Promise.all(
    courses.map(async (course) => {
      const courseEnrollments = enrollments.filter(
        (e) => e.course?._id?.toString() === course._id.toString()
      );
      const completed = courseEnrollments.filter((e) => e.status === 'completed').length;
      return {
        _id: course._id,
        title: course.title,
        category: course.category,
        level: course.level,
        isPublished: course.isPublished,
        enrolledStudents: courseEnrollments.length,
        completedStudents: completed,
        avgProgress:
          courseEnrollments.length > 0
            ? Math.round(
                courseEnrollments.reduce((sum, e) => sum + e.progress, 0) /
                  courseEnrollments.length
              )
            : 0,
      };
    })
  );

  res.json({
    success: true,
    stats: { totalCourses, totalStudents },
    courses: courseStats,
    recentEnrollments,
  });
});

// @desc  Get students for a specific course (with progress)
// @route GET /api/mentor/courses/:courseId/students
// @access Private (mentor)
const getCourseStudents = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view students for this course');
  }

  const totalLessons = await Lesson.countDocuments({ course: course._id });
  const enrollments = await Enrollment.find({ course: course._id })
    .populate('student', 'name email avatar')
    .sort('-createdAt');

  const students = enrollments.map((e) => ({
    _id: e._id,
    student: e.student,
    progress: e.progress,
    completedLessons: e.completedLessons.length,
    totalLessons,
    status: e.status,
    enrolledAt: e.enrolledAt,
  }));

  res.json({ success: true, count: students.length, students });
});

// @desc  Get all courses by the mentor (for management)
// @route GET /api/mentor/courses
// @access Private (mentor)
const getMentorCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id })
    .populate('instructor', 'name avatar')
    .sort('-createdAt');

  const coursesWithLessons = await Promise.all(
    courses.map(async (course) => {
      const lessonCount = await Lesson.countDocuments({ course: course._id });
      const enrollmentCount = await Enrollment.countDocuments({ course: course._id });
      return {
        ...course.toObject(),
        lessonCount,
        enrollmentCount,
      };
    })
  );

  res.json({ success: true, count: coursesWithLessons.length, courses: coursesWithLessons });
});

module.exports = { getMentorDashboard, getCourseStudents, getMentorCourses };

