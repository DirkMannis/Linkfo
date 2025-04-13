import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
}) ;

// Add request interceptor to add auth token
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

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
};

// Links services
const linksService = {
  getLinks: async () => {
    const response = await api.get('/links');
    return response.data;
  },
  
  addLink: async (link) => {
    const response = await api.post('/links', link);
    return response.data;
  },
  
  updateLink: async (id, link) => {
    const response = await api.put(`/links/${id}`, link);
    return response.data;
  },
  
  deleteLink: async (id) => {
    const response = await api.delete(`/links/${id}`);
    return response.data;
  },
};

// Persona services
const personaService = {
  getPersona: async () => {
    const response = await api.get('/persona');
    return response.data;
  },
  
  updatePersona: async () => {
    const response = await api.post('/persona/update');
    return response.data;
  },
  
  getSources: async () => {
    const response = await api.get('/persona/sources');
    return response.data;
  },
  
  addSource: async (source) => {
    const response = await api.post('/persona/sources', source);
    return response.data;
  },
};

// Chat services
const chatService = {
  getChatHistory: async () => {
    const response = await api.get('/chat/history');
    return response.data;
  },
  
  sendMessage: async (message) => {
    const response = await api.post('/chat/message', { message });
    return response.data;
  },
};

// Stats services
const statsService = {
  getStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },
};

export { api, authService, linksService, personaService, chatService, statsService };
