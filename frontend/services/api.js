import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',  // Empty string means same domain
  headers: {
    'Content-Type': 'application/json',
  },
}) ;

// Add request interceptor to include auth token
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

// Auth services
const authService = {
  register: async (name, email, password) => {
    console.log('Sending registration request to:', api.defaults.baseURL + '/api/auth/register');
    console.log('With data:', { name, email, password: '***' });
    
    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      console.log('Registration successful:', response.data);
      
      // Store token in localStorage
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error.response || error);
      throw error;
    }
  },
  
  login: async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      
      // Store token in localStorage
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login failed:', error.response || error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user failed:', error.response || error);
      throw error;
    }
  },
};

// Links services
const linksService = {
  getLinks: async () => {
    try {
      const response = await api.get('/api/links');
      return response.data;
    } catch (error) {
      console.error('Get links failed:', error.response || error);
      throw error;
    }
  },
  
  createLink: async (link) => {
    try {
      const response = await api.post('/api/links', link);
      return response.data;
    } catch (error) {
      console.error('Create link failed:', error.response || error);
      throw error;
    }
  },
  
  updateLink: async (id, link) => {
    try {
      const response = await api.put(`/api/links/${id}`, link);
      return response.data;
    } catch (error) {
      console.error('Update link failed:', error.response || error);
      throw error;
    }
  },
  
  deleteLink: async (id) => {
    try {
      const response = await api.delete(`/api/links/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete link failed:', error.response || error);
      throw error;
    }
  },
};

// Persona services
const personaService = {
  getPersona: async () => {
    try {
      const response = await api.get('/api/persona');
      return response.data;
    } catch (error) {
      console.error('Get persona failed:', error.response || error);
      throw error;
    }
  },
  
  updatePersona: async () => {
    try {
      const response = await api.post('/api/persona/update');
      return response.data;
    } catch (error) {
      console.error('Update persona failed:', error.response || error);
      throw error;
    }
  },
  
  getSources: async () => {
    try {
      const response = await api.get('/api/persona/sources');
      return response.data;
    } catch (error) {
      console.error('Get sources failed:', error.response || error);
      throw error;
    }
  },
  
  addSource: async (source) => {
    try {
      const response = await api.post('/api/persona/sources', source);
      return response.data;
    } catch (error) {
      console.error('Add source failed:', error.response || error);
      throw error;
    }
  },
};

// Import services
const importService = {
  previewLinktree: async (username) => {
    try {
      const response = await api.get(`/api/import/linktree/preview?username=${username}`);
      return response.data;
    } catch (error) {
      console.error('Preview Linktree failed:', error.response || error);
      throw error;
    }
  },
  
  importLinktree: async (username) => {
    try {
      const response = await api.post('/api/import/linktree/import', { username });
      return response.data;
    } catch (error) {
      console.error('Import Linktree failed:', error.response || error);
      throw error;
    }
  },
};

// Chat services
const chatService = {
  getChatHistory: async () => {
    try {
      const response = await api.get('/api/chat/history');
      return response.data;
    } catch (error) {
      console.error('Get chat history failed:', error.response || error);
      throw error;
    }
  },
  
  sendMessage: async (message) => {
    try {
      const response = await api.post('/api/chat/message', { message });
      return response.data;
    } catch (error) {
      console.error('Send message failed:', error.response || error);
      throw error;
    }
  },
};

// Stats services
const statsService = {
  getStats: async () => {
    try {
      const response = await api.get('/api/users/stats');
      return response.data;
    } catch (error) {
      console.error('Get stats failed:', error.response || error);
      throw error;
    }
  },
};

export { api, authService, linksService, personaService, importService, chatService, statsService };
