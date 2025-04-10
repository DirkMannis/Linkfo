"""
Content processor for cleaning and structuring collected data.
"""
import re
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from datetime import datetime
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

class ContentProcessor:
    """Content processor for cleaning and structuring collected data."""
    
    def __init__(self):
        """Initialize content processor."""
        self.stop_words = set(stopwords.words('english'))
    
    def clean_text(self, text):
        """Clean text by removing special characters and extra whitespace."""
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'https?://\S+|www\.\S+', '', text) 
        
        # Remove HTML tags
        text = re.sub(r'<.*?>', '', text)
        
        # Remove special characters and numbers
        text = re.sub(r'[^\w\s]', '', text)
        text = re.sub(r'\d+', '', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def extract_keywords(self, text, max_keywords=10):
        """Extract keywords from text."""
        # Clean text
        clean_text = self.clean_text(text)
        
        # Tokenize
        words = word_tokenize(clean_text)
        
        # Remove stop words
        words = [word for word in words if word not in self.stop_words and len(word) > 2]
        
        # Count word frequency
        word_freq = {}
        for word in words:
            if word in word_freq:
                word_freq[word] += 1
            else:
                word_freq[word] = 1
        
        # Sort by frequency
        sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        
        # Return top keywords
        return [word for word, freq in sorted_words[:max_keywords]]
    
    def extract_sentences(self, text, max_sentences=5):
        """Extract key sentences from text."""
        # Split into sentences
        sentences = sent_tokenize(text)
        
        # Score sentences based on keyword presence
        keywords = self.extract_keywords(text, max_keywords=20)
        sentence_scores = {}
        
        for sentence in sentences:
            score = 0
            for keyword in keywords:
                if keyword in sentence.lower():
                    score += 1
            sentence_scores[sentence] = score
        
        # Sort by score
        sorted_sentences = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)
        
        # Return top sentences
        return [sentence for sentence, score in sorted_sentences[:max_sentences]]
    
    def process_tweet(self, tweet):
        """Process a tweet to extract structured information."""
        processed = {
            'id': tweet['id_str'],
            'text': tweet['full_text'],
            'clean_text': self.clean_text(tweet['full_text']),
            'created_at': tweet['created_at'],
            'keywords': self.extract_keywords(tweet['full_text'], max_keywords=5),
            'engagement': {
                'retweets': tweet['retweet_count'],
                'likes': tweet['favorite_count']
            },
            'is_retweet': tweet['is_retweet'],
            'is_reply': tweet['is_reply'],
            'hashtags': tweet['hashtags'],
            'urls': tweet['urls'],
            'mentions': tweet['mentions']
        }
        
        return processed
    
    def process_web_content(self, content):
        """Process web content to extract structured information."""
        processed = {
            'url': content['url'],
            'title': content['title'],
            'description': content['description'],
            'clean_content': self.clean_text(content['content']),
            'keywords': self.extract_keywords(content['content'], max_keywords=15),
            'key_sentences': self.extract_sentences(content['content'], max_sentences=10),
            'links': content['links'],
            'images': content['images']
        }
        
        return processed
    
    def batch_process_tweets(self, tweets):
        """Process a batch of tweets."""
        return [self.process_tweet(tweet) for tweet in tweets]
    
    def batch_process_web_content(self, contents):
        """Process a batch of web content."""
        return [self.process_web_content(content) for content in contents]
