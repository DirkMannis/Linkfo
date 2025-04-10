"""
Persona model module for creating and managing persona models.
"""
import json
from datetime import datetime
from . import config

class PersonaModel:
    """Persona model for representing a user's online persona."""
    
    def __init__(self, user_id):
        """Initialize persona model."""
        self.user_id = user_id
        self.version = config.PERSONA_MODEL_VERSION
        self.created_at = datetime.now().isoformat()
        self.updated_at = self.created_at
        self.knowledge_domains = {}
        self.communication_style = {
            'formality': 'neutral',
            'verbosity': 'moderate',
            'expressiveness': 'neutral',
            'response_speed': 'moderate',
            'engagement_level': 'moderate',
            'helpfulness': 'helpful'
        }
        self.personality_traits = {}
        self.values_and_interests = {}
        self.content_sample_size = 0
        self.confidence_score = 0.0
    
    def update_knowledge_domains(self, domains):
        """Update knowledge domains in the persona model."""
        self.knowledge_domains = domains
        self.updated_at = datetime.now().isoformat()
    
    def update_communication_style(self, style):
        """Update communication style in the persona model."""
        self.communication_style = {
            'formality': style.get('formality', 'neutral'),
            'verbosity': style.get('verbosity', 'moderate'),
            'expressiveness': style.get('expressiveness', 'neutral'),
            'response_speed': self._derive_response_speed(style),
            'engagement_level': self._derive_engagement_level(style),
            'helpfulness': self._derive_helpfulness(style)
        }
        self.updated_at = datetime.now().isoformat()
    
    def _derive_response_speed(self, style):
        """Derive response speed from engagement analysis."""
        posting_patterns = style.get('posting_patterns', {})
        posts_per_day = posting_patterns.get('posts_per_day', 0)
        
        if posts_per_day > 5:
            return 'fast'
        elif posts_per_day > 1:
            return 'moderate'
        else:
            return 'slow'
    
    def _derive_engagement_level(self, style):
        """Derive engagement level from interaction patterns."""
        interaction_patterns = style.get('interaction_patterns', {})
        interaction_style = interaction_patterns.get('interaction_style', 'balanced')
        
        if interaction_style == 'conversational':
            return 'highly_engaged'
        elif interaction_style == 'balanced':
            return 'moderately_engaged'
        else:
            return 'selectively_engaged'
    
    def _derive_helpfulness(self, style):
        """Derive helpfulness from question handling."""
        question_handling = style.get('question_handling', {})
        question_style = question_handling.get('question_style', 'balanced')
        
        if question_style == 'inquisitive':
            return 'very_helpful'
        elif question_style == 'balanced':
            return 'helpful'
        else:
            return 'informative'
    
    def update_personality_traits(self, traits):
        """Update personality traits in the persona model."""
        self.personality_traits = traits
        self.updated_at = datetime.now().isoformat()
    
    def update_values_and_interests(self, values_interests):
        """Update values and interests in the persona model."""
        self.values_and_interests = values_interests
        self.updated_at = datetime.now().isoformat()
    
    def update_metadata(self, content_sample_size, confidence_score):
        """Update metadata in the persona model."""
        self.content_sample_size = content_sample_size
        self.confidence_score = confidence_score
        self.updated_at = datetime.now().isoformat()
    
    def to_dict(self):
        """Convert persona model to dictionary."""
        return {
            'user_id': self.user_id,
            'version': self.version,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'knowledge_domains': self.knowledge_domains,
            'communication_style': self.communication_style,
            'personality_traits': self.personality_traits,
            'values_and_interests': self.values_and_interests,
            'content_sample_size': self.content_sample_size,
            'confidence_score': self.confidence_score
        }
    
    def to_json(self):
        """Convert persona model to JSON string."""
        return json.dumps(self.to_dict(), indent=2)
    
    @classmethod
    def from_dict(cls, data):
        """Create persona model from dictionary."""
        model = cls(data['user_id'])
        model.version = data.get('version', config.PERSONA_MODEL_VERSION)
        model.created_at = data.get('created_at', model.created_at)
        model.updated_at = data.get('updated_at', model.updated_at)
        model.knowledge_domains = data.get('knowledge_domains', {})
        model.communication_style = data.get('communication_style', model.communication_style)
        model.personality_traits = data.get('personality_traits', {})
        model.values_and_interests = data.get('values_and_interests', {})
        model.content_sample_size = data.get('content_sample_size', 0)
        model.confidence_score = data.get('confidence_score', 0.0)
        return model
    
    @classmethod
    def from_json(cls, json_str):
        """Create persona model from JSON string."""
        data = json.loads(json_str)
        return cls.from_dict(data)
