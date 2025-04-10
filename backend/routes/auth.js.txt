const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock user data for prototype
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

// Register new user
router.post('/register', (req, res)  => {
  const { email, password, name } = req.body;
  
  // Validate input
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  // Check if user already exists
  const userExists = Object.values(users).find(user => user.email === email);
  if (userExists) {
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
  
  // Generate JWT token
  const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  }) ;
  
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
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  // Find user
  const user = Object.values(users).find(user => user.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Check password
  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', {
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
});

// Verify JWT token middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = router;
module.exports.verifyToken = verifyToken;
