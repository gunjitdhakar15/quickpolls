import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (email, password) => api.post('/auth/register', { email, password }),
    login: (email, password) => api.post('/auth/login', { email, password })
};

// Polls API (aligned with backend)
export const pollsAPI = {
    getAll: () => api.get('/polls'),
    getOne: (id) => api.get(`/polls/${id}`),
    getResults: (id) => api.get(`/polls/${id}/results`),
    create: (payload) => api.post('/polls', payload),
    vote: (pollId, voterId, optionIndexes) =>
        api.post(`/polls/${pollId}/vote`, { voterId, optionIndexes }),
    delete: (pollId) => api.delete(`/polls/${pollId}`)
};

export default api;

