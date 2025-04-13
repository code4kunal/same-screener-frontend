import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (email: string, password: string) =>
    api.post('/auth/token', { username: email, password }),
  register: (email: string, password: string, fullName: string) =>
    api.post('/auth/register', { email, password, full_name: fullName }),
  getMe: () => api.get('/auth/me'),
};

export const screeners = {
  list: () => api.get('/screeners'),
  get: (id: string) => api.get(`/screeners/${id}`),
  create: (data: any) => api.post('/screeners', data),
  run: (id: string, params: any) => api.post(`/screeners/${id}/run`, params),
  backtest: (id: string, params: any) => api.post(`/screeners/${id}/backtest`, params),
};

export const analytics = {
  getScreenerAnalytics: (id: string) => api.get(`/analytics/screener/${id}`),
};

export const cases = {
  list: () => api.get('/cases'),
  get: (id: string) => api.get(`/cases/${id}`),
};

export default api; 