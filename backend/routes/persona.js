const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth');

// Mock persona data for prototype
const personaModels = {
  '1': {
    user_id: '1',
    version: '0.1',
    created_at: '2025-04-08T12:00:00Z',
    updated_at: '2025-04-08T12:00:00Z',
    knowledge_domains: {
      'Artificial Intelligence': {
        expertise_level: 0.85,
        frequency: 0.72,
        keywords: ['machine learning', 'neural networks', 'deep learning', 'AI ethics', 'computer vision'],
        confidence: 0.78
      },
      'Technology': {
        expertise_level: 0.75,
        frequency: 0.65,
        keywords: ['digital transformation', 'innovation', 'tech trends', 'future tech', 'emerging tech'],
        confidence: 0.70
      },
      'Digital Marketing': {
        expertise_level: 0.68,
        frequency: 0.45,
        keywords: ['content strategy', 'social media', 'audience engagement', 'analytics', 'brand building'],
        confidence: 0.56
      }
    },
    communication_style: {
      formality: 'neutral',
      verbosity: 'moderate',
      expressiveness: 'moderately_expressive',
      response_speed: 'fast',
      engagement_level: 'highly_engaged',
      helpfulness: 'very_helpful'
    },
    personality_traits: {
      positivity: {
        value: 'positive',
        confidence: 0.82
      },
      analytical_thinking: {
        value: 'highly_analytical',
        confidence: 0.75
      },
      social_orientation: {
        value: 'outgoing',
        confidence: 0.68
      }
    },
    values_and_interests: {
      innovation: {
        type: 'value',
        level: 0.88,
        related_terms: ['innovative', 'new', 'creative', 'future', 'technology'],
        confidence: 0.88
      },
      growth: {
        type: 'value',
        level: 0.76,
        related_terms: ['learn', 'improve', 'develop', 'progress', 'better'],
        confidence: 0.76
      },
      'Machine Learning': {
        type: 'interest',
        level: 0.92,
        related_terms: ['algorithms', 'data science', 'neural networks', 'predictive models', 'training'],
        confidence: 0.92
      }
    },
    content_sample_size: 250,
    confidence_score: 0.75
  }
};

// Mock content sources data
const contentSources = {
  '1': [
    {
      id: '1',
      type: 'twitter',
      username: 'alexjohnson',
      status: 'connected',
      last_updated: '2025-04-07T15:30:00Z'
    },
    {
      id: '2',
      type: 'instagram',
      username: 'alexjohnson',
      status: 'connected',
      last_updated: '2025-04-07T15:35:00Z'
    },
    {
      id: '3',
      type: 'blog',
      url: 'https://alexjohnson.blog',
      status: 'connected',
      last_updated: '2025-04-07T16:00:00Z'
    },
    {
      id: '4',
      type: 'youtube',
      username: '',
      status: 'disconnected',
      last_updated: null
    }
  ]
};

// Get persona model
router.get('/', verifyToken, (req, res)  => {
  const persona = personaModels[req.userId];
  
  if (!persona) {
    return res.status(404).json({ message: 'Persona not found' });
  }
  
  res.json(persona);
});

// Update persona model
router.post('/update', verifyToken, (req, res) => {
  const persona = personaModels[req.userId];
  
  if (!persona) {
    return res.status(404).json({ message: 'Persona not found' });
  }
  
  // In a real implementation, this would trigger the persona learning process
  // For the prototype, we'll just update the timestamp
  persona.updated_at = new Date().toISOString();
  
  res.json({
    message: 'Persona update initiated',
    status: 'processing',
    estimated_completion_time: '5 minutes'
  });
});

// Get content sources
router.get('/sources', verifyToken, (req, res) => {
  const sources = contentSources[req.userId] || [];
  res.json(sources);
});

// Add content source
router.post('/sources', verifyToken, (req, res) => {
  const { type, username, url } = req.body;
  
  // Validate input
  if (!type || (type !== 'blog' && !username) || (type === 'blog' && !url)) {
    return res.status(400).json({ message: 'Invalid source data' });
  }
  
  // Initialize sources array if it doesn't exist
  if (!contentSources[req.userId]) {
    contentSources[req.userId] = [];
  }
  
  // Create new source
  const newSource = {
    id: String(contentSources[req.userId].length + 1),
    type,
    username: type !== 'blog' ? username : '',
    url: type === 'blog' ? url : '',
    status: 'connected',
    last_updated: new Date().toISOString()
  };
  
  // Add to sources array
  contentSources[req.userId].push(newSource);
  
  res.status(201).json(newSource);
});

module.exports = router;
