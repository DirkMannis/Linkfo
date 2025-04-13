// backend/routes/import.js

const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth');
const { spawn } = require('child_process');
const path = require('path');

// Import from Linktree
router.post('/linktree', verifyToken, (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }
  
  // Call Python script to scrape Linktree
  const pythonProcess = spawn('python3', [
    path.join(__dirname, '../scripts/import_linktree.py'),
    username
  ]);
  
  let profileData = '';
  
  pythonProcess.stdout.on('data', (data) => {
    profileData += data.toString();
  });
  
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error from Python script: ${data}`);
  });
  
  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ message: 'Failed to import Linktree profile' });
    }
    
    try {
      const profile = JSON.parse(profileData);
      
      // In a real implementation, this would save the imported data to the database
      // For the prototype, we'll just return the scraped data
      
      res.json({
        message: 'Linktree profile imported successfully',
        profile
      });
    } catch (error) {
      console.error('Error parsing profile data:', error);
      res.status(500).json({ message: 'Failed to parse imported profile data' });
    }
  });
});

// Preview Linktree import
router.get('/linktree/preview/:username', verifyToken, (req, res) => {
  const { username } = req.params;
  
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }
  
  // Call Python script to scrape Linktree
  const pythonProcess = spawn('python3', [
    path.join(__dirname, '../scripts/import_linktree.py'),
    username
  ]);
  
  let profileData = '';
  
  pythonProcess.stdout.on('data', (data) => {
    profileData += data.toString();
  });
  
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error from Python script: ${data}`);
  });
  
  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ message: 'Failed to preview Linktree profile' });
    }
    
    try {
      const profile = JSON.parse(profileData);
      
      res.json({
        message: 'Linktree profile preview generated',
        profile
      });
    } catch (error) {
      console.error('Error parsing profile data:', error);
      res.status(500).json({ message: 'Failed to parse profile data for preview' });
    }
  });
});

module.exports = router;
