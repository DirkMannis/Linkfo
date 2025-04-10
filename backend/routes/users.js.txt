const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth');

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

// Get user profile
router.get('/profile', verifyToken, (req, res)  => {
  const user = users[req.userId];
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    bio: user.bio,
    profileImage: user.profileImage
  });
});

// Update user profile
router.put('/profile', verifyToken, (req, res) => {
  const { name, bio, profileImage } = req.body;
  const user = users[req.userId];
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Update user data
  if (name) user.name = name;
  if (bio) user.bio = bio;
  if (profileImage) user.profileImage = profileImage;
  
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    bio: user.bio,
    profileImage: user.profileImage
  });
});

// Get user stats
router.get('/stats', verifyToken, (req, res) => {
  // In a real implementation, this would fetch actual stats
  res.json({
    profileViews: 1245,
    linkClicks: 867,
    chatInteractions: 342,
    topLinks: [
      { id: '1', title: 'My Website', clicks: 324 },
      { id: '3', title: 'YouTube Channel', clicks: 218 },
      { id: '2', title: 'Twitter', clicks: 189 }
    ]
  });
});

module.exports = router;
