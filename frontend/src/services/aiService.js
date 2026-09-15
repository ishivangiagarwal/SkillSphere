import api from './api';

export const chatWithAI = (prompt, mode) => api.post('/ai/chat', { prompt, mode }).then((r) => r.data);
export const getChatHistory = () => api.get('/ai/history').then((r) => r.data);
export const deleteChatEntry = (id) => api.delete(`/ai/history/${id}`).then((r) => r.data);
