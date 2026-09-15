import api from './api';

export const getPosts = () => api.get('/posts').then((r) => r.data);
export const createPost = (data) => api.post('/posts', data).then((r) => r.data);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data).then((r) => r.data);
export const deletePost = (id) => api.delete(`/posts/${id}`).then((r) => r.data);
export const toggleLike = (id) => api.put(`/posts/${id}/like`).then((r) => r.data);
export const addComment = (id, text) => api.post(`/posts/${id}/comments`, { text }).then((r) => r.data);
