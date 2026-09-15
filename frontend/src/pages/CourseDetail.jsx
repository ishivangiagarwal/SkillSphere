import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, Clock, PlayCircle, Trash2, Plus, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import * as courseService from '../services/courseService';
import * as enrollmentService from '../services/enrollmentService';
import Loader from '../components/Loader';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';
import Card from '../components/Card';

const CourseDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [viewingLesson, setViewingLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState({ title: '', content: '', videoUrl: '', order: 1, duration: 10 });

  const isOwner = course && user && (course.instructor?._id === user._id || user.role === 'admin');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await courseService.getCourseById(id);
      setCourse(res.course);
      setLessons(res.lessons);
      if (isAuthenticated) {
        const myEnrollments = await enrollmentService.getMyEnrollments();
        const found = myEnrollments.enrollments.find((e) => e.course?._id === id);
        setEnrollment(found || null);
      }
    } catch (err) {
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }
    setEnrolling(true);
    try {
      await enrollmentService.enrollInCourse(id);
      toast.success('Enrolled successfully!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const handleToggleLesson = async (lessonId) => {
    try {
      const res = await enrollmentService.markLessonComplete(id, lessonId);
      setEnrollment(res.enrollment);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update lesson progress');
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      await courseService.addLesson(id, lessonForm);
      toast.success('Lesson added successfully');
      setShowLessonModal(false);
      setLessonForm({ title: '', content: '', videoUrl: '', order: lessons.length + 2, duration: 10 });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add lesson');
    }
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm('Delete this course permanently? This cannot be undone.')) return;
    try {
      await courseService.deleteCourse(id);
      toast.success('Course deleted');
      navigate('/courses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete course');
    }
  };

  if (loading) return <Loader full />;
  if (!course) return null;

  const isLessonDone = (lessonId) => enrollment?.completedLessons?.some((l) => l === lessonId || l._id === lessonId);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-primary-950 via-primary-800 to-indigo-950 p-6 sm:p-10 text-white relative overflow-hidden border border-white/5 shadow-xl">
        <div className="absolute top-10 right-10 h-64 w-64 rounded-full bg-primary-600/20 blur-[90px] pointer-events-none" />
        <div className="mb-4 flex flex-wrap items-center gap-2 z-10 relative">
          <Badge text={course.level} variant={course.level} />
          <span className="rounded-lg bg-white/10 px-2.5 py-0.5 text-xs font-bold text-primary-200 border border-white/10">{course.category}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight z-10 relative">{course.title}</h1>
        <p className="mt-3 max-w-3xl text-sm sm:text-base text-gray-300 leading-relaxed z-10 relative">{course.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-gray-400 z-10 relative">
          <span className="font-semibold text-gray-300">Created by {course.instructor?.name}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {course.duration} hours duration</span>
          <span>{lessons.length} structured modules</span>
        </div>
        <div className="mt-8 flex flex-wrap gap-3 z-10 relative">
          {isOwner ? (
            <>
              <button onClick={() => setShowLessonModal(true)} className="btn-primary bg-white text-primary-800 hover:bg-gray-100 shadow-none">
                <Plus className="h-4 w-4" /> Add Lesson
              </button>
              <button onClick={handleDeleteCourse} className="inline-flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-5 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-all">
                <Trash2 className="h-4 w-4" /> Delete Course
              </button>
            </>
          ) : enrollment ? (
            <span className="rounded-xl bg-white/10 border border-white/10 px-5 py-2.5 text-sm font-bold text-primary-200">
              Enrolled - {enrollment.progress}% complete
            </span>
          ) : (
            <button onClick={handleEnroll} disabled={enrolling} className="btn-primary bg-white text-primary-800 hover:bg-gray-100 shadow-none">
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </button>
          )}
        </div>
      </div>

      {enrollment && (
        <Card className="p-5 border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard">
          <h3 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">Your Current Progress</h3>
          <ProgressBar value={enrollment.progress} />
        </Card>
      )}

      <Card className="p-6 border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Course Content</h2>
        {lessons.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-400">No lessons added yet.</p>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson, idx) => {
              const done = isLessonDone(lesson._id);
              return (
                <div key={lesson._id} onClick={() => setViewingLesson(lesson)} className="cursor-pointer rounded-2xl border border-purple-50 hover:border-primary-300 dark:border-royal-darkBorder dark:hover:border-primary-800 p-5 bg-gray-50/20 dark:bg-royal-darkBg/10 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {enrollment ? (
                        <button onClick={(e) => { e.stopPropagation(); handleToggleLesson(lesson._id); }} className="mt-0.5 flex-shrink-0">
                          {done ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-50 dark:fill-emerald-950/20" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-300 hover:text-primary-500 transition-colors" />
                          )}
                        </button>
                      ) : (
                        <PlayCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-300" />
                      )}
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">{idx + 1}. {lesson.title}</p>
                        <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{lesson.content}</p>
                        <span className="mt-3 inline-block text-xs font-bold text-primary-600 dark:text-primary-400 group-hover:underline">Read Lesson &rarr;</span>
                      </div>
                    </div>
                    <span className="flex-shrink-0 text-xs text-gray-400 font-semibold">{lesson.duration} mins</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Modal isOpen={!!viewingLesson} onClose={() => setViewingLesson(null)} title={viewingLesson?.title || 'Lesson Details'} maxWidth="max-w-2xl">
        {viewingLesson && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-purple-50 dark:border-royal-darkBorder pb-3 text-xs text-gray-400">
              <span className="font-semibold">{viewingLesson.duration} min read duration</span>
              {enrollment && (
                <button onClick={() => { handleToggleLesson(viewingLesson._id); }} className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
                  {isLessonDone(viewingLesson._id) ? 'Mark incomplete' : 'Mark complete'}
                </button>
              )}
            </div>
            <div className="rounded-xl bg-gray-50/50 dark:bg-royal-darkBg/30 p-5 border border-purple-50 dark:border-royal-darkBorder leading-relaxed text-sm text-gray-700 dark:text-gray-400 whitespace-pre-wrap font-sans">
              {viewingLesson.content}
            </div>
            {viewingLesson.videoUrl && (
              <a href={viewingLesson.videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:underline">
                Watch Video Resources &rarr;
              </a>
            )}
            <div className="flex justify-end pt-2">
              <button onClick={() => setViewingLesson(null)} className="btn-secondary">Close</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={showLessonModal} onClose={() => setShowLessonModal(false)} title="Create New Module Lesson">
        <form onSubmit={handleAddLesson} className="space-y-4">
          <div>
            <label className="label-text">Lesson Title</label>
            <input required className="input-field" placeholder="e.g. Intro to Hooks" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} />
          </div>
          <div>
            <label className="label-text">Lesson Content</label>
            <textarea required rows={5} className="input-field" placeholder="Enter lesson study contents here..." value={lessonForm.content} onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })} />
          </div>
          <div>
            <label className="label-text">Video URL (optional)</label>
            <input className="input-field" placeholder="https://youtube.com/..." value={lessonForm.videoUrl} onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Module Order</label>
              <input type="number" min="1" className="input-field" value={lessonForm.order} onChange={(e) => setLessonForm({ ...lessonForm, order: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label-text">Duration (mins)</label>
              <input type="number" min="1" className="input-field" value={lessonForm.duration} onChange={(e) => setLessonForm({ ...lessonForm, duration: Number(e.target.value) })} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowLessonModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Lesson</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CourseDetail;
