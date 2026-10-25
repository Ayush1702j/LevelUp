import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('levelup_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if checking auth or on login/register pages
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/register' && path !== '/') {
        localStorage.removeItem('levelup_token');
        localStorage.removeItem('levelup_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/password', data)
};

export const challengesAPI = {
  getAll: (params) => API.get('/challenges', { params }),
  getToday: () => API.get('/challenges/today'),
  getById: (id) => API.get(`/challenges/${id}`),
  complete: (id) => API.post(`/challenges/${id}/complete`)
};

export const tasksAPI = {
  getAll: (params) => API.get('/tasks', { params }),
  create: (data) => API.post('/tasks', data),
  update: (id, data) => API.put(`/tasks/${id}`, data),
  delete: (id) => API.delete(`/tasks/${id}`)
};

export const habitsAPI = {
  getAll: () => API.get('/habits'),
  create: (data) => API.post('/habits', data),
  update: (id, data) => API.put(`/habits/${id}`, data),
  delete: (id) => API.delete(`/habits/${id}`),
  toggle: (id, date) => API.post(`/habits/${id}/toggle`, { date })
};

export const vocabularyAPI = {
  getAll: (params) => API.get('/vocabulary', { params }),
  getRandom: () => API.get('/vocabulary/random'),
  submitAnswer: (id, selectedAnswer) => API.post(`/vocabulary/${id}/answer`, { selectedAnswer })
};

export const grammarAPI = {
  getAll: (params) => API.get('/grammar', { params }),
  submitAnswer: (id, selectedAnswer) => API.post(`/grammar/${id}/answer`, { selectedAnswer })
};

export const progressAPI = {
  getSummary: () => API.get('/progress'),
  getWeekly: () => API.get('/progress/weekly'),
  getCategory: () => API.get('/progress/category')
};

export const achievementsAPI = {
  getAll: () => API.get('/achievements'),
  getUserAchievements: () => API.get('/achievements/user')
};

export const thoughtsAPI = {
  getToday: () => API.get('/thoughts/today'),
  submit: (data) => API.post('/thoughts', data),
  getHistory: () => API.get('/thoughts/history')
};

export default API;
