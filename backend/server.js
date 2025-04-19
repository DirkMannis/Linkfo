const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

// Initialize logger
const logger = {
  info: (message) => console.log(`[INFO] ${message}`),
  error: (message, error) => console.error(`[ERROR] ${message}`, error || '')
};

// Log server startup
logger.info('Server starting');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
logger.info('Setting up middleware');
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simple test endpoint - DIRECTLY IN SERVER.JS
app.get('/api/test', (req, res) => {
  logger.info('Test endpoint called');
  res.status(200).json({ message: 'API is working!' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Linkfo API' });
});

// Import routes - SIMPLIFIED FOR TESTING
try {
  logger.info('Setting up routes');
  // Comment out route imports for now to simplify testing
  // const authRoutes = require('./routes/auth');
  // const usersRoutes = require('./routes/users');
  // const linksRoutes = require('./routes/links');
  // const personaRoutes = require('./routes/persona');
  // const chatRoutes = require('./routes/chat');

  // Routes
  // app.use('/api/auth', authRoutes);
  // app.use('/api/users', usersRoutes);
  // app.use('/api/links', linksRoutes);
  // app.use('/api/persona', personaRoutes);
  // app.use('/api/chat', chatRoutes);
  logger.info('Routes setup complete');
} catch (error) {
  logger.error('Error setting up routes:', error);
}

// Catch-all route for unmatched routes
app.use('*', (req, res) => {
  logger.info(`Unmatched route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});

// Export for Vercel serverless functions
module.exports = app;
