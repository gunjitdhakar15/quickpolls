import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Your backend URL
});

// Add token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (name, email, password) => api.post('/auth/register', { name, email, password }),
    login: (email, password) => api.post('/auth/login', { email, password }),
};

export const pollsAPI = {
    getPolls: () => api.get('/polls'),
    getMyPolls: () => api.get('/polls/my-polls'),
    createPoll: (pollData) => api.post('/polls', pollData),
    getPoll: (id) => api.get(`/polls/${id}`),
    vote: (pollId, optionIndex) => api.post(`/polls/${pollId}/vote`, { optionIndex }),
    deletePoll: (id) => api.delete(`/polls/${id}`),
};

export default api;
