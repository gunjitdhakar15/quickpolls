import axios from 'axios';
import { getToken } from '../utils/auth';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auto-attach authorization token
API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me')
};

export const pollsAPI = {
  getAll: () => API.get('/polls'),
  getOne: (id) => API.get(`/polls/${id}`),
  create: (pollData) => API.post('/polls', pollData),
  vote: (id, optionId) => API.post(`/polls/${id}/vote`, { optionId }),
  triggerAI: (id) => API.post(`/polls/${id}/ai`),
  delete: (id) => API.delete(`/polls/${id}`)
};

export default API;
