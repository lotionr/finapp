import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiService = {
  // User endpoints
  createUser: async (userData) => {
    const response = await apiClient.post('/api/users', userData);
    return response.data;
  },

  getUser: async (userId) => {
    const response = await apiClient.get(`/api/users/${userId}`);
    return response.data;
  },

  getUserByEmail: async (email) => {
    const response = await apiClient.get(`/api/users/email/${encodeURIComponent(email)}`);
    return response.data;
  },

  // Portfolio endpoints
  analyzePortfolio: async (requestData) => {
    const response = await apiClient.post('/api/portfolio/analyze', requestData);
    return response.data;
  },

  getPortfolio: async (userId) => {
    const response = await apiClient.get(`/api/portfolio/${userId}`);
    return response.data;
  },

  updatePortfolio: async (userId, portfolioData) => {
    const response = await apiClient.put(`/api/portfolio/${userId}`, portfolioData);
    return response.data;
  },

  // Financial plan endpoints
  generatePlan: async (requestData) => {
    const response = await apiClient.post('/api/plan/generate', requestData);
    return response.data;
  },
};

export const api = apiService;

