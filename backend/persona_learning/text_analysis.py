"""
Text analysis module for analyzing content and extracting insights.
"""
import re
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from collections import Counter
import string
from . import config

# Download NLTK resources
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

class TextAnalyzer:
    """Text analyzer for extracting insights from content."""
    
    def __init__(self):
        """Initialize text analyzer."""
        self.stop_words = set(stopwords.words('english'))
    
    def preprocess_text(self, text):
        """Preprocess text for analysis."""
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'https?://\S+|www\.\S+', '', text) 
        
        # Remove HTML tags
        text = re.sub(r'<.*?>', '', text)
        
        # Remove punctuation
        text = text.translate(str.maketrans('', '', string.punctuation))
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def tokenize(self, text):
        """Tokenize text into words and sentences."""
        # Preprocess text
        processed_text = self.preprocess_text(text)
        
        # Tokenize into sentences
        sentences = sent_tokenize(text)
        
        # Tokenize into words
        words = word_tokenize(processed_text)
        
        # Remove stop words
        filtered_words = [word for word in words if word not in self.stop_words and len(word) > 2]
        
        return {
            'sentences': sentences,
            'words': filtered_words,
            'word_count': len(words),
            'sentence_count': len(sentences),
            'avg_words_per_sentence': len(words) / len(sentences) if len(sentences) > 0 else 0
        }
    
    def identify_topics(self, texts, max_topics=5):
        """Identify main topics in a collection of texts."""
        # Combine all texts
        combined_text = ' '.join(texts)
        
        # Tokenize
        tokens = self.tokenize(combined_text)
        
        # Count word frequency
        word_freq = Counter(tokens['words'])
        
        # Identify topics based on domain keywords
        domain_scores = {}
        
        for domain, keywords in config.DOMAIN_KEYWORDS.items():
            score = 0
            domain_hits = []
            
            for keyword in keywords:
                # Check for exact matches
                if keyword in word_freq:
                    hits = word_freq[keyword]
                    score += hits
                    domain_hits.append((keyword, hits))
                
                # Check for partial matches
                for word in word_freq:
                    if keyword in word and word != keyword:
                        hits = word_freq[word]
                        score += hits * 0.5  # Lower weight for partial matches
                        domain_hits.append((word, hits))
            
            # Calculate domain score
            if score > 0:
                domain_scores[domain] = {
                    'score': score,
                    'hits': domain_hits,
                    'normalized_score': score / tokens['word_count'] if tokens['word_count'] > 0 else 0
                }
        
        # Sort domains by score
        sorted_domains = sorted(domain_scores.items(), key=lambda x: x[1]['score'], reverse=True)
        
        # Return top domains
        top_domains = {}
        for domain, data in sorted_domains[:max_topics]:
            top_domains[domain] = {
                'expertise_level': min(data['normalized_score'] * 10, 1.0),  # Scale to 0-1
                'frequency': data['score'] / tokens['word_count'] if tokens['word_count'] > 0 else 0,
                'keywords': [hit[0] for hit in data['hits'][:10]],
                'confidence': min(data['normalized_score'] * 5 + 0.5, 1.0)  # Scale to 0.5-1.0
            }
        
        return top_domains
    
    def analyze_sentiment(self, text):
        """Analyze sentiment of text (positive, negative, neutral)."""
        # This is a simplified sentiment analysis
        # A real implementation would use a more sophisticated model
        
        # Preprocess text
        processed_text = self.preprocess_text(text)
        
        # Tokenize
        tokens = word_tokenize(processed_text)
        
        # Count positive and negative words
        positive_count = 0
        negative_count = 0
        
        for word in tokens:
            if word in config.PERSONALITY_MARKERS['positivity']['positive']:
                positive_count += 1
            elif word in config.PERSONALITY_MARKERS['positivity']['negative']:
                negative_count += 1
        
        # Calculate sentiment score (-1 to 1)
        total_count = positive_count + negative_count
        if total_count > 0:
            sentiment_score = (positive_count - negative_count) / total_count
        else:
            sentiment_score = 0
        
        # Determine sentiment label
        if sentiment_score > 0.2:
            sentiment = 'positive'
        elif sentiment_score < -0.2:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
        
        return {
            'score': sentiment_score,
            'label': sentiment,
            'positive_count': positive_count,
            'negative_count': negative_count,
            'confidence': min(abs(sentiment_score) + 0.5, 1.0)  # Scale to 0.5-1.0
        }
    
    def analyze_writing_style(self, texts):
        """Analyze writing style (formality, verbosity, expressiveness)."""
        # Combine all texts
        combined_text = ' '.join(texts)
        
        # Tokenize
        tokens = self.tokenize(combined_text)
        
        # Analyze formality
        formal_count = 0
        informal_count = 0
        
        for word in tokens['words']:
            if word in config.FORMALITY_MARKERS['formal']:
                formal_count += 1
            elif word in config.FORMALITY_MARKERS['informal']:
                informal_count += 1
        
        # Calculate formality score (0 to 1)
        total_markers = formal_count + informal_count
        if total_markers > 0:
            formality_score = formal_count / total_markers
        else:
            formality_score = 0.5  # Neutral
        
        # Determine formality label
        if formality_score > 0.7:
            formality = 'formal'
        elif formality_score < 0.3:
            formality = 'informal'
        else:
            formality = 'neutral'
        
        # Analyze verbosity
        avg_words_per_sentence = tokens['avg_words_per_sentence']
        
        if avg_words_per_sentence < config.VERBOSITY_THRESHOLD['concise']:
            verbosity = 'concise'
        elif avg_words_per_sentence > config.VERBOSITY_THRESHOLD['verbose']:
            verbosity = 'verbose'
        else:
            verbosity = 'moderate'
        
        # Analyze expressiveness (simplified)
        # Count exclamation marks, question marks, and emoticons
        exclamations = combined_text.count('!')
        questions = combined_text.count('?')
        emoticons = len(re.findall(r'[:;]-?[)(/]', combined_text))
        
        expressiveness_score = (exclamations + questions + emoticons) / tokens['sentence_count'] if tokens['sentence_count'] > 0 else 0
        
        if expressiveness_score > 0.3:
            expressiveness = 'highly_expressive'
        elif expressiveness_score > 0.1:
            expressiveness = 'moderately_expressive'
        else:
            expressiveness = 'reserved'
        
        return {
            'formality': formality,
            'verbosity': verbosity,
            'expressiveness': expressiveness,
            'formality_score': formality_score,
            'avg_words_per_sentence': avg_words_per_sentence,
            'expressiveness_score': expressiveness_score
        }
    
    def extract_values_and_interests(self, texts, max_items=10):
        """Extract values and interests from texts."""
        # Combine all texts
        combined_text = ' '.join(texts)
        
        # Tokenize
        tokens = self.tokenize(combined_text)
        
        # Find sentences containing value indicators
        value_sentences = []
        for sentence in sent_tokenize(combined_text):
            for keyword in config.VALUES_KEYWORDS:
                if keyword in sentence.lower():
                    value_sentences.append(sentence)
                    break
        
        # Extract potential values and interests
        values_and_interests = {}
        
        # Process domain keywords as potential interests
        for domain, keywords in config.DOMAIN_KEYWORDS.items():
            for keyword in keywords:
                if keyword in tokens['words']:
                    # Count occurrences
                    count = tokens['words'].count(keyword)
                    
                    # Calculate interest level
                    level = min(count / 10, 1.0)  # Scale to 0-1
                    
                    if level > 0.3:  # Only include significant interests
                        # Find related terms
                        related_terms = []
                        for word in tokens['words']:
                            if word != keyword and (word in keyword or keyword in word):
                                related_terms.append(word)
                        
                        values_and_interests[keyword] = {
                            'type': 'interest',
                            'level': level,
                            'related_terms': list(set(related_terms))[:5],
                            'confidence': level
                        }
        
        # Extract values from value sentences
        for sentence in value_sentences:
            words = word_tokenize(self.preprocess_text(sentence))
            for word in words:
                if word not in self.stop_words and len(word) > 3 and word not in config.VALUES_KEYWORDS:
                    # Check if word is a potential value
                    if word in values_and_interests:
                        values_and_interests[word]['type'] = 'value'
                    else:
                        values_and_interests[word] = {
                            'type': 'value',
                            'level': 0.7,  # Default level for values
                            'related_terms': [],
                            'confidence': 0.6
                        }
        
        # Sort by level
        sorted_items = sorted(values_and_interests.items(), key=lambda x: x[1]['level'], reverse=True)
        
        # Return top items
        result = {}
        for item, data in sorted_items[:max_items]:
            result[item] = data
        
        return result
