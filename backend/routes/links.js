const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth');

// Mock links data for prototype
const links = {
  '1': [
    {
      id: '1',
      userId: '1',
      title: 'My Website',
      url: 'https://alexjohnson.com',
      icon: 'FaGlobe',
      color: '#0080FF',
      position: 1,
      clicks: 324
    },
    {
      id: '2',
      userId: '1',
      title: 'Twitter',
      url: 'https://twitter.com/alexjohnson',
      icon: 'FaTwitter',
      color: '#1DA1F2',
      position: 2,
      clicks: 189
    },
    {
      id: '3',
      userId: '1',
      title: 'YouTube Channel',
      url: 'https://youtube.com/alexjohnson',
      icon: 'FaYoutube',
      color: '#FF0000',
      position: 3,
      clicks: 218
    },
    {
      id: '4',
      userId: '1',
      title: 'My Latest Article',
      url: 'https://medium.com/@alexjohnson/latest',
      icon: 'FaMedium',
      color: '#00AB6C',
      position: 4,
      clicks: 136
    }
  ]
};

// Get all links for a user
router.get('/', verifyToken, (req, res)  => {
  const userLinks = links[req.userId] || [];
  res.json(userLinks);
});

// Add a new link
router.post('/', verifyToken, (req, res) => {
  const { title, url, icon, color } = req.body;
  
  // Validate input
  if (!title || !url) {
    return res.status(400).json({ message: 'Title and URL are required' });
  }
  
  // Initialize links array if it doesn't exist
  if (!links[req.userId]) {
    links[req.userId] = [];
  }
  
  // Create new link
  const newLink = {
    id: String(links[req.userId].length + 1),
    userId: req.userId,
    title,
    url,
    icon: icon || 'FaLink',
    color: color || '#0080FF',
    position: links[req.userId].length + 1,
    clicks: 0
  };
  
  // Add to links array
  links[req.userId].push(newLink);
  
  res.status(201).json(newLink);
});

// Update an existing link
router.put('/:id', verifyToken, (req, res) => {
  const { title, url, icon, color, position } = req.body;
  const linkId = req.params.id;
  
  // Find link index
  const userLinks = links[req.userId] || [];
  const linkIndex = userLinks.findIndex(link => link.id === linkId);
  
  if (linkIndex === -1) {
    return res.status(404).json({ message: 'Link not found' });
  }
  
  // Update link
  const updatedLink = {
    ...userLinks[linkIndex],
    title: title || userLinks[linkIndex].title,
    url: url || userLinks[linkIndex].url,
    icon: icon || userLinks[linkIndex].icon,
    color: color || userLinks[linkIndex].color,
    position: position || userLinks[linkIndex].position
  };
  
  userLinks[linkIndex] = updatedLink;
  
  // If position changed, reorder links
  if (position && position !== userLinks[linkIndex].position) {
    userLinks.sort((a, b) => a.position - b.position);
  }
  
  res.json(updatedLink);
});

// Delete a link
router.delete('/:id', verifyToken, (req, res) => {
  const linkId = req.params.id;
  
  // Find link index
  const userLinks = links[req.userId] || [];
  const linkIndex = userLinks.findIndex(link => link.id === linkId);
  
  if (linkIndex === -1) {
    return res.status(404).json({ message: 'Link not found' });
  }
  
  // Remove link
  userLinks.splice(linkIndex, 1);
  
  // Update positions
  userLinks.forEach((link, index) => {
    link.position = index + 1;
  });
  
  res.json({ message: 'Link deleted successfully' });
});

module.exports = router;
