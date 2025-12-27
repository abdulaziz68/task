import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

export const shopDrawingsAPI = {
  getAll: (params?: any) => api.get('/shop-drawings', { params }),
  getById: (id: number) => api.get(`/shop-drawings/${id}`),
  create: (data: FormData) => api.post('/shop-drawings', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: FormData) => api.put(`/shop-drawings/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => api.delete(`/shop-drawings/${id}`),
  download: (id: number) => api.get(`/shop-drawings/${id}/download`, {
    responseType: 'blob',
  }),
};

export const rfisAPI = {
  getAll: (params?: any) => api.get('/rfis', { params }),
  getById: (id: number) => api.get(`/rfis/${id}`),
  create: (data: FormData) => api.post('/rfis', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: any) => api.put(`/rfis/${id}`, data),
  delete: (id: number) => api.delete(`/rfis/${id}`),
  addAttachment: (id: number, file: FormData) => api.post(`/rfis/${id}/attachments`, file, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteAttachment: (attachmentId: number) => api.delete(`/rfis/attachments/${attachmentId}`),
  downloadAttachment: (attachmentId: number) => api.get(`/rfis/attachments/${attachmentId}/download`, {
    responseType: 'blob',
  }),
};

export const meetingsAPI = {
  getAll: (params?: any) => api.get('/meeting-minutes', { params }),
  getById: (id: number) => api.get(`/meeting-minutes/${id}`),
  create: (data: FormData) => api.post('/meeting-minutes', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: any) => api.put(`/meeting-minutes/${id}`, data),
  delete: (id: number) => api.delete(`/meeting-minutes/${id}`),
  addAttachment: (id: number, file: FormData) => api.post(`/meeting-minutes/${id}/attachments`, file, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteAttachment: (attachmentId: number) => api.delete(`/meeting-minutes/attachments/${attachmentId}`),
  downloadAttachment: (attachmentId: number) => api.get(`/meeting-minutes/attachments/${attachmentId}/download`, {
    responseType: 'blob',
  }),
};

export const engineersAPI = {
  getAll: (params?: any) => api.get('/engineers', { params }),
  getById: (id: number) => api.get(`/engineers/${id}`),
  create: (data: any) => api.post('/engineers', data),
  update: (id: number, data: any) => api.put(`/engineers/${id}`, data),
  delete: (id: number) => api.delete(`/engineers/${id}`),
};

export const tasksAPI = {
  getAll: (params?: any) => api.get('/tasks', { params }),
  getById: (id: number) => api.get(`/tasks/${id}`),
  getLinkedItems: (id: number) => api.get(`/tasks/${id}/linked`),
  create: (data: any) => api.post('/tasks', data),
  update: (id: number, data: any) => api.put(`/tasks/${id}`, data),
  delete: (id: number) => api.delete(`/tasks/${id}`),
};

export const notificationsAPI = {
  getAll: (params?: any) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id: number) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id: number) => api.delete(`/notifications/${id}`),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
