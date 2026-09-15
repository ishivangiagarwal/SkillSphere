import api from './api';

export const getMentorDashboard = () => api.get('/mentor/dashboard').then((r) => r.data);
export const getMentorCourses = () => api.get('/mentor/courses').then((r) => r.data);
export const getCourseStudents = (courseId) =>
  api.get(`/mentor/courses/${courseId}/students`).then((r) => r.data);

