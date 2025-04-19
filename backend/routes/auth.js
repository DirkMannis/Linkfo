const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

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

// Check if JWT_SECRET is set
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  logger.error('JWT_SECRET environment variable is not set');
}

// Mock user data for prototype
// In production, this would be replaced with a MongoDB model
const users = {
  '1': {
    id: '1',
    email: 'user@example.com',
    password: 'password123',
    name: 'Alex Johnson',
    bio: 'AI researcher and technology enthusiast',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
  }
};

// Middleware to verify JWT token
const verifyToken = (req, res, next)  => {
  try {
    // Get auth header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      logger.error('No Authorization header provided');
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      logger.error('Token is not a Bearer token');
      return res.status(401).json({ message: 'Invalid token format. Must be a Bearer token.' });
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      logger.error('Token is empty');
      return res.status(401).json({ message: 'Access denied. Token is empty.' });
    }
    
    // Verify token
    try {
      const verified = jwt.verify(token, JWT_SECRET || 'your-secret-key');
      req.userId = verified.userId;
      logger.info(`Token verified for user ID: ${req.userId}`);
      next();
    } catch (error) {
      logger.error('Token verification failed', error);
      return res.status(401).json({ message: 'Invalid token.' });
    }
  } catch (error) {
    logger.error('Error in verifyToken middleware', error);
    return res.status(500).json({ message: 'Internal server error during authentication.' });
  }
};

// Register new user
router.post('/register', (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    logger.info(`Attempting to register user: ${email}`);
    
    // Validate input
    if (!email || !password || !name) {
      logger.error('Registration failed: Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const userExists = Object.values(users).find(user => user.email === email);
    if (userExists) {
      logger.error(`Registration failed: User already exists: ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const newUser = {
      id: String(Object.keys(users).length + 1),
      email,
      password, // In a real app, this would be hashed
      name,
      bio: '',
      profileImage: 'https://randomuser.me/api/portraits/lego/1.jpg'
    };
    
    // Add to users object
    users[newUser.id] = newUser;
    logger.info(`User registered successfully: ${email} with ID: ${newUser.id}`) ;
    
    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d'
    });
    
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        bio: newUser.bio,
        profileImage: newUser.profileImage
      }
    });
  } catch (error) {
    logger.error('Error in register endpoint', error);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
});

// Login user
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    logger.info(`Attempting login for user: ${email}`);
    
    // Validate input
    if (!email || !password) {
      logger.error('Login failed: Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user
    const user = Object.values(users).find(user => user.email === email);
    if (!user) {
      logger.error(`Login failed: User not found: ${email}`);
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    if (user.password !== password) {
      logger.error(`Login failed: Invalid password for user: ${email}`);
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    logger.info(`User logged in successfully: ${email}`);
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d'
    });
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        bio: user.bio,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    logger.error('Error in login endpoint', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
});

// Get current user
router.get('/me', verifyToken, (req, res) => {
  try {
    const user = users[req.userId];
    
    if (!user) {
      logger.error(`Get current user failed: User not found with ID: ${req.userId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    
    logger.info(`Retrieved current user: ${user.email}`);
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        bio: user.bio,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    logger.error('Error in get current user endpoint', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
module.exports.verifyToken = verifyToken;