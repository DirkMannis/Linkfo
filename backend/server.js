console.log('Server initialization starting');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const logger = {
  info: (message) => {
    console.log(JSON.stringify({ level: 'info', message }));
  },
  error: (message, error) => {
    console.error(JSON.stringify({ level: 'error', message, error: error?.message }));
  }
};

console.log('Connecting to MongoDB...');
// After connection attempt
console.log('MongoDB connection status:', connected ? 'Connected' : 'Failed');

// Import routes
console.log('Modules imported successfully');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const linksRoutes = require('./routes/links');
const personaRoutes = require('./routes/persona');
const chatRoutes = require('./routes/chat');
const importRoutes = require('./routes/import');

// Initialize express app
console.log('Initializing Express app');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/import', importRoutes);

// Connect to MongoDB (commented out for prototype)
console.log('Attempting MongoDB connection with URI:', process.env.MONGODB_URI ? 'URI exists' : 'URI missing');

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

console.log('MongoDB connection attempt completed');

logger.info('Server starting');
logger.info(`Connecting to MongoDB at ${process.env.MONGODB_URI ? '[URI exists]' : '[URI missing]'}`);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/links', linksRoutes);
app.use('/api/persona', personaRoutes);
app.use('/api/chat', chatRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Linkfo API' });
});

// Start server
console.log('Starting server on port:', process.env.PORT || 5000);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Server startup complete');
});

module.exports = app;


app.get('/api/test-logs', (req, res) => {
  console.log('Test log endpoint called');
  logger.info('Test log endpoint called with info logger');
  logger.error('Test error log', new Error('This is a test error'));
  
  // Log environment variables (be careful not to log sensitive data)
  logger.info(`Environment: ${process.env.NODE_ENV}`);
  logger.info(`MongoDB URI exists: ${Boolean(process.env.MONGODB_URI)}`);
  
  res.json({ message: 'Logs generated, check Vercel logs' });
});
