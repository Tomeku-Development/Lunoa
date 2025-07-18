import axios from 'axios';

// Backend API base URL - adjust based on your backend setup
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token');
      // You can add redirect logic here
    }
    return Promise.reject(error);
  }
);

// Authentication API endpoints
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: {
    fullName: string;
    username: string;
    email: string;
    password: string;
  }) => {
    const response = await apiClient.post('/auth/register', {
      full_name: userData.fullName,
      username: userData.username,
      email: userData.email,
      password: userData.password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
};

// API endpoint functions
export const dashboardAPI = {
  // Analytics endpoints
  getDashboardMetrics: () => apiClient.get('/analytics/dashboard'),
  getRealTimeStats: () => apiClient.get('/analytics/realtime'),
  getUserAnalytics: (userId: string) => apiClient.get(`/analytics/user/${userId}`),
  getQuestAnalytics: (questId: string) => apiClient.get(`/analytics/quest/${questId}`),

  // User endpoints
  getUserProfile: (userId: string) => apiClient.get(`/users/${userId}`),
  getUserStats: (userId: string) => apiClient.get(`/users/${userId}/stats`),
  getUserActivity: (userId: string) => apiClient.get(`/users/${userId}/activity`),
  
  // Quest endpoints
  getAllQuests: (params?: any) => apiClient.get('/quests', { params }),
  getQuestById: (questId: string) => apiClient.get(`/quests/${questId}`),
  createQuest: (data: any) => apiClient.post('/quests', data),
  
  // Token endpoints
  getTokenBalance: (address: string) => apiClient.get(`/tokens/balance/${address}`),
  getTokenHistory: (address: string, params?: any) => apiClient.get(`/tokens/history/${address}`, { params }),
  getTokenStatistics: () => apiClient.get('/tokens/statistics'),
  
  // Notification endpoints
  getNotifications: (params?: any) => apiClient.get('/notifications', { params }),
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),
  markAsRead: (notificationIds?: string[]) => apiClient.post('/notifications/mark-read', { notificationIds }),
  
  // Auth endpoints
  connectWallet: (data: any) => apiClient.post('/auth/connect', data),
  verifyToken: () => apiClient.post('/auth/verify'),
  refreshToken: () => apiClient.post('/auth/refresh'),
  logout: () => apiClient.post('/auth/logout'),
};

export default apiClient;
