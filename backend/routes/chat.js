const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth');

// Mock chat history data
const chatHistory = {
  '1': [
    {
      id: '1',
      sender: 'agent',
      text: "Hi there! I'm the AI agent for Alex Johnson. I can tell you about Alex's content, interests, and expertise. How can I help you today?",
      timestamp: '2025-04-08T10:00:00Z'
    }
  ]
};

// Get chat history
router.get('/history', verifyToken, (req, res) => {
  const history = chatHistory[req.userId] || [];
  res.json(history);
});

// Send message to AI agent
router.post('/message', verifyToken, (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }
  
  // Initialize chat history if it doesn't exist
  if (!chatHistory[req.userId]) {
    chatHistory[req.userId] = [];
  }
  
  // Add user message to history
  const userMessage = {
    id: String(chatHistory[req.userId].length + 1),
    sender: 'user',
    text: message,
    timestamp: new Date().toISOString()
  };
  
  chatHistory[req.userId].push(userMessage);
  
  // Generate agent response based on persona model
  // In a real implementation, this would use the persona learning module
  const agentResponse = generateAgentResponse(message, req.userId);
  
  // Add agent response to history
  chatHistory[req.userId].push(agentResponse);
  
  res.json(agentResponse);
});

// Simple response generation for prototype
function generateAgentResponse(message, userId) {
  const lowerMessage = message.toLowerCase();
  let responseText = '';
  
  // Get user name from persona model if available
  const persona = require('./persona').personaModels?.[userId];
  const userName = 'Alex Johnson'; // Default name
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    responseText = `Hello! I'm ${userName}'s AI agent. How can I help you today?`;
  } else if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
    responseText = `I'm an AI agent that represents ${userName}. I've learned from their social media posts, articles, and online presence to help answer questions and engage with their audience.`;
  } else if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
    responseText = `You can contact ${userName} directly via email at alex@example.com or through any of the social media platforms listed above.`;
  } else if (lowerMessage.includes('content') || lowerMessage.includes('post') || lowerMessage.includes('article')) {
    responseText = `${userName} regularly posts content about AI, technology trends, and digital innovation. Their most recent articles focus on machine learning applications and the future of AI assistants. Check out their blog for the latest posts!`;
  } else if (lowerMessage.includes('interest') || lowerMessage.includes('hobby') || lowerMessage.includes('like')) {
    responseText = `${userName} is passionate about artificial intelligence, emerging technologies, digital art, and hiking. They often share their thoughts on these topics across their social platforms.`;
  } else if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence') || lowerMessage.includes('machine learning')) {
    responseText = `${userName} has extensive expertise in AI and machine learning. They've written about neural networks, deep learning, AI ethics, and practical applications of machine learning in business. Is there a specific aspect of AI you'd like to know more about?`;
  } else if (lowerMessage.includes('technology') || lowerMessage.includes('tech') || lowerMessage.includes('digital')) {
    responseText = `${userName} follows technology trends closely and writes about digital transformation, innovation, and emerging technologies. They're particularly interested in how technology can solve real-world problems.`;
  } else {
    responseText = `Thanks for your message! ${userName} is interested in AI, technology, and digital innovation. Is there something specific you'd like to know about their work or interests?`;
  }
  
  return {
    id: String(chatHistory[userId].length + 1),
    sender: 'agent',
    text: responseText,
    timestamp: new Date().toISOString()
  };
}

module.exports = router;
