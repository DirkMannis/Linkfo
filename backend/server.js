const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

console.log('Server starting...');
console.log('Connecting to MongoDB...');
// After connection attempt
console.log('MongoDB connection status:', connected ? 'Connected' : 'Failed');

// Import routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const linksRoutes = require('./routes/links');
const personaRoutes = require('./routes/persona');
const chatRoutes = require('./routes/chat');
const importRoutes = require('./routes/import');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/import', importRoutes);

// Connect to MongoDB (commented out for prototype)
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
