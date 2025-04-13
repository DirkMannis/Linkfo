"""
Configuration module for persona learning.
"""

# Model configuration
MIN_CONTENT_ITEMS = 10
MAX_CONTENT_ITEMS = 1000
CONFIDENCE_THRESHOLD = 0.6

# Knowledge domains configuration
DOMAIN_KEYWORDS = {
    'Artificial Intelligence': [
        'ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 
        'neural networks', 'nlp', 'natural language processing', 'computer vision',
        'ai ethics', 'reinforcement learning', 'supervised learning', 'unsupervised learning'
    ],
    'Technology': [
        'technology', 'tech', 'digital', 'innovation', 'software', 'hardware',
        'programming', 'coding', 'development', 'engineering', 'product', 'startup',
        'emerging tech', 'future tech', 'digital transformation'
    ],
    'Business': [
        'business', 'entrepreneurship', 'startup', 'management', 'leadership',
        'strategy', 'marketing', 'sales', 'finance', 'investment', 'venture capital',
        'economics', 'market', 'industry', 'growth', 'scaling'
    ],
    'Science': [
        'science', 'research', 'scientific', 'physics', 'chemistry', 'biology',
        'astronomy', 'medicine', 'healthcare', 'climate', 'environment', 'sustainability',
        'experiment', 'discovery', 'innovation', 'breakthrough'
    ],
    'Arts': [
        'art', 'design', 'creative', 'music', 'film', 'photography', 'literature',
        'writing', 'poetry', 'painting', 'sculpture', 'performance', 'theater',
        'culture', 'aesthetic', 'artistic'
    ],
    'Health': [
        'health', 'wellness', 'fitness', 'nutrition', 'diet', 'exercise', 'mental health',
        'meditation', 'mindfulness', 'healthcare', 'medical', 'wellbeing', 'lifestyle',
        'healthy living', 'self-care'
    ],
    'Education': [
        'education', 'learning', 'teaching', 'school', 'university', 'college',
        'academic', 'student', 'teacher', 'professor', 'course', 'curriculum',
        'knowledge', 'skill', 'training', 'development'
    ],
    'Digital Marketing': [
        'marketing', 'digital marketing', 'social media', 'content marketing',
        'seo', 'sem', 'email marketing', 'analytics', 'audience', 'engagement',
        'conversion', 'brand', 'advertising', 'growth hacking', 'influencer'
    ]
}

# Communication style parameters
FORMALITY_MARKERS = {
    'formal': [
        'therefore', 'thus', 'consequently', 'furthermore', 'moreover',
        'in addition', 'in conclusion', 'subsequently', 'nevertheless',
        'however', 'regarding', 'concerning', 'with respect to'
    ],
    'informal': [
        'yeah', 'cool', 'awesome', 'btw', 'lol', 'haha', 'gonna', 'wanna',
        'gotta', 'kinda', 'sorta', 'y\'all', 'folks', 'stuff', 'things'
    ]
}

VERBOSITY_THRESHOLD = {
    'concise': 15,  # Average words per sentence
    'moderate': 25,
    'verbose': 35
}

# Personality traits configuration
PERSONALITY_MARKERS = {
    'positivity': {
        'positive': [
            'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome',
            'good', 'best', 'love', 'happy', 'excited', 'opportunity', 'success'
        ],
        'negative': [
            'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'sad',
            'disappointed', 'failure', 'problem', 'issue', 'difficult', 'challenging'
        ]
    },
    'analytical_thinking': {
        'analytical': [
            'analyze', 'analysis', 'research', 'data', 'evidence', 'study',
            'experiment', 'hypothesis', 'theory', 'framework', 'methodology',
            'systematic', 'logical', 'rational', 'objective'
        ],
        'intuitive': [
            'feel', 'sense', 'intuition', 'gut', 'instinct', 'emotion',
            'experience', 'subjective', 'personal', 'impression', 'perception'
        ]
    },
    'social_orientation': {
        'outgoing': [
            'team', 'community', 'network', 'collaboration', 'together',
            'social', 'connect', 'engage', 'share', 'participate', 'join'
        ],
        'reserved': [
            'individual', 'personal', 'private', 'independent', 'autonomy',
            'self', 'alone', 'focus', 'concentrate', 'reflect', 'contemplate'
        ]
    }
}

# Values and interests configuration
VALUES_KEYWORDS = [
    'important', 'value', 'believe', 'principle', 'ethics', 'moral',
    'right', 'wrong', 'good', 'bad', 'should', 'must', 'need to',
    'essential', 'critical', 'crucial', 'significant', 'meaningful'
]

# Output configuration
PERSONA_MODEL_VERSION = '0.1'
