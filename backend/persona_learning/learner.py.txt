"""
Persona learner module for learning user personas from collected data.
"""
from .text_analysis import TextAnalyzer
from .engagement_analysis import EngagementAnalyzer
from .persona_model import PersonaModel
from . import config

class PersonaLearner:
    """Persona learner for learning user personas from collected data."""
    
    def __init__(self):
        """Initialize persona learner."""
        self.text_analyzer = TextAnalyzer()
        self.engagement_analyzer = EngagementAnalyzer()
    
    def learn_persona(self, user_id, tweets, web_content):
        """Learn persona from collected data."""
        # Check if we have enough data
        if (not tweets or len(tweets) < config.MIN_CONTENT_ITEMS) and \
           (not web_content or len(web_content) < config.MIN_CONTENT_ITEMS):
            print(f"Not enough content for user {user_id}")
            return None
        
        # Create persona model
        persona = PersonaModel(user_id)
        
        # Extract text content
        tweet_texts = [tweet['full_text'] for tweet in tweets if 'full_text' in tweet]
        web_texts = [content['content'] for content in web_content if 'content' in content]
        all_texts = tweet_texts + web_texts
        
        # Calculate content sample size
        content_sample_size = len(tweet_texts) + len(web_texts)
        
        # Learn knowledge domains
        if all_texts:
            knowledge_domains = self.text_analyzer.identify_topics(all_texts)
            persona.update_knowledge_domains(knowledge_domains)
        
        # Learn communication style
        if tweets:
            engagement_data = self.engagement_analyzer.analyze_all_engagement(tweets)
            writing_style = self.text_analyzer.analyze_writing_style(tweet_texts)
            
            communication_style = {
                'formality': writing_style['formality'],
                'verbosity': writing_style['verbosity'],
                'expressiveness': writing_style['expressiveness'],
                'posting_patterns': engagement_data['posting_patterns'] if engagement_data else {},
                'interaction_patterns': engagement_data['interaction_patterns'] if engagement_data else {},
                'question_handling': engagement_data['question_handling'] if engagement_data else {}
            }
            
            persona.update_communication_style(communication_style)
        
        # Learn personality traits
        if all_texts:
            # Analyze sentiment for positivity
            sentiment = self.text_analyzer.analyze_sentiment(' '.join(all_texts))
            
            # Analyze analytical thinking
            analytical_words = 0
            intuitive_words = 0
            
            for word in ' '.join(all_texts).lower().split():
                if word in config.PERSONALITY_MARKERS['analytical_thinking']['analytical']:
                    analytical_words += 1
                elif word in config.PERSONALITY_MARKERS['analytical_thinking']['intuitive']:
                    intuitive_words += 1
            
            analytical_ratio = analytical_words / (analytical_words + intuitive_words) if (analytical_words + intuitive_words) > 0 else 0.5
            
            # Analyze social orientation
            outgoing_words = 0
            reserved_words = 0
            
            for word in ' '.join(all_texts).lower().split():
                if word in config.PERSONALITY_MARKERS['social_orientation']['outgoing']:
                    outgoing_words += 1
                elif word in config.PERSONALITY_MARKERS['social_orientation']['reserved']:
                    reserved_words += 1
            
            social_ratio = outgoing_words / (outgoing_words + reserved_words) if (outgoing_words + reserved_words) > 0 else 0.5
            
            # Create personality traits
            personality_traits = {
                'positivity': {
                    'value': sentiment['label'],
                    'confidence': sentiment['confidence']
                },
                'analytical_thinking': {
                    'value': 'highly_analytical' if analytical_ratio > 0.7 else 'balanced' if analytical_ratio > 0.3 else 'intuitive',
                    'confidence': abs(analytical_ratio - 0.5) * 2  # Scale to 0-1
                },
                'social_orientation': {
                    'value': 'outgoing' if social_ratio > 0.7 else 'balanced' if social_ratio > 0.3 else 'reserved',
                    'confidence': abs(social_ratio - 0.5) * 2  # Scale to 0-1
                }
            }
            
            persona.update_personality_traits(personality_traits)
        
        # Learn values and interests
        if all_texts:
            values_and_interests = self.text_analyzer.extract_values_and_interests(all_texts)
            persona.update_values_and_interests(values_and_interests)
        
        # Calculate confidence score
        confidence_score = self._calculate_confidence_score(persona, content_sample_size)
        
        # Update metadata
        persona.update_metadata(content_sample_size, confidence_score)
        
        return persona
    
    def _calculate_confidence_score(self, persona, content_sample_size):
        """Calculate overall confidence score for the persona model."""
        # Base confidence on content sample size
        if content_sample_size >= config.MAX_CONTENT_ITEMS:
            base_confidence = 1.0
        else:
            base_confidence = content_sample_size / config.MAX_CONTENT_ITEMS
        
        # Adjust based on knowledge domains
        domain_confidence = 0.0
        if persona.knowledge_domains:
            domain_confidences = [domain['confidence'] for domain in persona.knowledge_domains.values()]
            domain_confidence = sum(domain_confidences) / len(domain_confidences) if domain_confidences else 0.0
        
        # Adjust based on personality traits
        trait_confidence = 0.0
        if persona.personality_traits:
            trait_confidences = [trait['confidence'] for trait in persona.personality_traits.values()]
            trait_confidence = sum(trait_confidences) / len(trait_confidences) if trait_confidences else 0.0
        
        # Calculate weighted average
        confidence_score = (base_confidence * 0.5) + (domain_confidence * 0.3) + (trait_confidence * 0.2)
        
        return min(confidence_score, 1.0)  # Cap at 1.0
