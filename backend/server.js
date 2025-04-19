const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
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
  origin: '*',  // For development; restrict this in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Vercel-specific logging
if (process.env.VERCEL) {
  logger.info('Running in Vercel environment');
  
  // Log all requests in Vercel
  app.use((req, res, next) => {
    logger.info(`Vercel request: ${req.method} ${req.url}`);
    next();
  });
}

// Check for JWT_SECRET
if (!process.env.JWT_SECRET) {
  logger.error('JWT_SECRET environment variable is not set!');
  // In production, you might want to exit the process
  // process.exit(1);
}

// Connect to MongoDB (uncomment when ready to use a real database)
/*
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => logger.info('Connected to MongoDB'))
.catch(err => logger.error('MongoDB connection error:', err));
*/

// Simple test endpoint
app.get('/api/test', (req, res) => {
  logger.info('Test endpoint called');
  res.status(200).json({ message: 'API is working!' });
});

// Import routes using absolute paths
logger.info('Setting up routes');
const authRoutes = require(path.join(__dirname, './routes/auth'));
const usersRoutes = require(path.join(__dirname, './routes/users'));
const linksRoutes = require(path.join(__dirname, './routes/links'));
const personaRoutes = require(path.join(__dirname, './routes/persona'));
const chatRoutes = require(path.join(__dirname, './routes/chat'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/links', linksRoutes);
app.use('/api/persona', personaRoutes);
app.use('/api/chat', chatRoutes);
logger.info('Routes set up');

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Linkfo API' });
});

// Catch-all route for unmatched routes
app.use('*', (req, res) => {
  logger.info(`Unmatched route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});

// Start server only in development environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless functions
module.exports = app;
