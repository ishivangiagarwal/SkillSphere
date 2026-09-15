import api from './api';

export const getCourses = (params) => api.get('/courses', { params }).then((r) => r.data);
export const getCourseById = (id) => api.get(`/courses/${id}`).then((r) => r.data);
export const createCourse = (data) => api.post('/courses', data).then((r) => r.data);
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data).then((r) => r.data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`).then((r) => r.data);
export const addLesson = (courseId, data) => api.post(`/courses/${courseId}/lessons`, data).then((r) => r.data);
