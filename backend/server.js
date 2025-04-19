// Server initialization starting

require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

console.log('Server initialization starting');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

console.log('Modules imported successfully');

// Import routes
const { router: authRoutes, verifyToken } = require('./routes/auth');
app.use('/api/auth', authRoutes);

const usersRoutes = require('./routes/users');
const linksRoutes = require('./routes/links');
const personaRoutes = require('./routes/persona');
const chatRoutes = require('./routes/chat');
const importRoutes = require('./routes/import');

// Initialize express app
console.log('Initializing Express app');
const app = express();
const PORT = process.env.PORT || 5000;

// Better logging for Vercel
const logger = {
  info: (message) => {
    console.log(JSON.stringify({ level: 'info', message, timestamp: new Date().toISOString() }));
  },
  error: (message, error) => {
    console.error(JSON.stringify({ 
      level: 'error', 
      message, 
      error: error?.message || 'Unknown error', 
      timestamp: new Date().toISOString() 
    }));
  }
};

// Log environment variables (safely)
logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
logger.info(`MongoDB URI exists: ${Boolean(process.env.MONGODB_URI)}`);
logger.info(`JWT Secret exists: ${Boolean(process.env.JWT_SECRET)}`);

if (!process.env.JWT_SECRET) {
  logger.error('JWT_SECRET environment variable is not set!');
  // In production, you might want to exit the process
  // process.exit(1);
}

// Middleware
logger.info('Setting up middleware');
app.use(cors({
  origin: ['https://linkfo-pi.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
  credentials: true
}) );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
logger.info('Attempting MongoDB connection');
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch(err => {
    logger.error('MongoDB connection error', err);
  });
} else {
  logger.error('MongoDB URI is missing');
}

// Routes
logger.info('Setting up routes');
 app.use('/api/auth', authRoutes);
 app.use('/api/users', usersRoutes);
 app.use('/api/links', linksRoutes);
 app.use('/api/persona', personaRoutes);
 app.use('/api/chat', chatRoutes);
 app.use('/api/import', importRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  logger.info('Health check endpoint called');
  
app.get('/api/test', (req, res) => {
  console.log('Test endpoint called');
  res.json({ message: 'API is working!' });

  // Check MongoDB connection
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected';
  
  // Return basic health information
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    message: 'If you can see this, the API is working!'
  });
});

// Root route
app.get('/', (req, res) => {
  logger.info('Root endpoint called');
  res.json({ message: 'Welcome to Linkfo API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Express error handler caught an error', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
logger.info(`Starting server on port: ${PORT}`);
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Add a catch-all route at the end to log unmatched routes
app.use('*', (req, res) => {
  console.log(`Unmatched route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });

// For Vercel serverless functions
module.exports = app;
