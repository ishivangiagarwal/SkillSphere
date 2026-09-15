import api from './api';

export const getStats = () => api.get('/admin/stats').then((r) => r.data);
export const getAllUsers = () => api.get('/admin/users').then((r) => r.data);
export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data).then((r) => r.data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`).then((r) => r.data);
export const adminDeleteCourse = (id) => api.delete(`/admin/courses/${id}`).then((r) => r.data);
export const adminDeletePost = (id) => api.delete(`/admin/posts/${id}`).then((r) => r.data);
export const getMentors = () => api.get('/admin/mentors').then((r) => r.data);
export const approveMentor = (id, data) => api.put(`/admin/mentors/${id}/approve`, data).then((r) => r.data);
