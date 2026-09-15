import api from './api';

export const getMyResume = () => api.get('/resumes/my').then((r) => r.data);
export const saveResume = (data) => api.put('/resumes/my', data).then((r) => r.data);
