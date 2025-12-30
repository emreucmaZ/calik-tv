import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Hesap API'leri
export const accountApi = {
  getAll: () => api.get('/accounts'),
  getOne: (id) => api.get(`/accounts/${id}`),
  create: (data) => api.post('/accounts', data),
  update: (id, data) => api.put(`/accounts/${id}`, data),
  delete: (id) => api.delete(`/accounts/${id}`)
};

// Stream API'leri
export const streamApi = {
  getStatus: () => api.get('/stream/status'),
  start: (accountId) => api.post('/stream/start', { accountId }),
  stop: () => api.post('/stream/stop'),
  getLogs: () => api.get('/stream/logs')
};

export default api;
