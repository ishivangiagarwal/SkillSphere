import api from './api';

export const getDashboard = () => api.get('/users/dashboard').then((r) => r.data);
export const getUserProfile = (id) => api.get(`/users/${id}`).then((r) => r.data);
export const updateProfile = (data) => api.put('/users/profile', data).then((r) => r.data);
