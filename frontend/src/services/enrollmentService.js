import api from './api';

export const enrollInCourse = (courseId) => api.post(`/enrollments/${courseId}`).then((r) => r.data);
export const getMyEnrollments = () => api.get('/enrollments/my').then((r) => r.data);
export const markLessonComplete = (courseId, lessonId) =>
  api.put(`/enrollments/${courseId}/lessons/${lessonId}`).then((r) => r.data);
