"""
Database module for storing collected data.
"""
import pymongo
from datetime import datetime
from . import config

class Database:
    """Database connection and operations for data collection."""
    
    def __init__(self):
        """Initialize database connection."""
        self.client = None
        self.db = None
        self.connected = False
    
    def connect(self):
        """Connect to MongoDB database."""
        try:
            self.client = pymongo.MongoClient(config.MONGODB_URI)
            self.db = self.client[config.DB_NAME]
            self.connected = True
            print(f"Connected to database: {config.DB_NAME}")
            return True
        except Exception as e:
            print(f"Error connecting to database: {str(e)}")
            self.connected = False
            return False
    
    def disconnect(self):
        """Disconnect from MongoDB database."""
        if self.client:
            self.client.close()
            self.connected = False
            print("Disconnected from database")
    
    def save_tweets(self, tweets, user_id):
        """Save tweets to database."""
        if not self.connected:
            if not self.connect():
                return False
        
        collection = self.db[config.COLLECTION_TWEETS]
        
        for tweet in tweets:
            # Add metadata
            tweet['user_id'] = user_id
            tweet['collected_at'] = datetime.now()
            
            # Check if tweet already exists
            existing = collection.find_one({'id_str': tweet['id_str']})
            if not existing:
                collection.insert_one(tweet)
        
        return True
    
    def save_profile(self, profile, user_id):
        """Save social media profile to database."""
        if not self.connected:
            if not self.connect():
                return False
        
        collection = self.db[config.COLLECTION_PROFILES]
        
        # Add metadata
        profile['user_id'] = user_id
        profile['collected_at'] = datetime.now()
        
        # Check if profile already exists and update
        existing = collection.find_one({
            'platform': profile['platform'],
            'platform_id': profile['platform_id']
        })
        
        if existing:
            collection.update_one(
                {'_id': existing['_id']},
                {'$set': profile}
            )
        else:
            collection.insert_one(profile)
        
        return True
    
    def save_web_content(self, content, user_id):
        """Save web content to database."""
        if not self.connected:
            if not self.connect():
                return False
        
        collection = self.db[config.COLLECTION_CONTENT]
        
        # Add metadata
        content['user_id'] = user_id
        content['collected_at'] = datetime.now()
        
        # Check if content already exists and update
        existing = collection.find_one({
            'url': content['url']
        })
        
        if existing:
            collection.update_one(
                {'_id': existing['_id']},
                {'$set': content}
            )
        else:
            collection.insert_one(content)
        
        return True
    
    def get_tweets(self, user_id, limit=100):
        """Get tweets for a user."""
        if not self.connected:
            if not self.connect():
                return []
        
        collection = self.db[config.COLLECTION_TWEETS]
        tweets = list(collection.find(
            {'user_id': user_id},
            {'_id': 0}
        ).sort('created_at', -1).limit(limit))
        
        return tweets
    
    def get_profiles(self, user_id):
        """Get social media profiles for a user."""
        if not self.connected:
            if not self.connect():
                return []
        
        collection = self.db[config.COLLECTION_PROFILES]
        profiles = list(collection.find(
            {'user_id': user_id},
            {'_id': 0}
        ))
        
        return profiles
    
    def get_web_content(self, user_id, limit=100):
        """Get web content for a user."""
        if not self.connected:
            if not self.connect():
                return []
        
        collection = self.db[config.COLLECTION_CONTENT]
        content = list(collection.find(
            {'user_id': user_id},
            {'_id': 0}
        ).sort('collected_at', -1).limit(limit))
        
        return content
