"""
Configuration module for data collection.
"""

# API Keys (these would be loaded from environment variables in production)
TWITTER_API_KEY = "your_twitter_api_key"
TWITTER_API_SECRET = "your_twitter_api_secret"
TWITTER_ACCESS_TOKEN = "your_twitter_access_token"
TWITTER_ACCESS_SECRET = "your_twitter_access_secret"

# Database configuration
MONGODB_URI = "mongodb://localhost:27017/linkfo"
DB_NAME = "linkfo"
COLLECTION_TWEETS = "tweets"
COLLECTION_PROFILES = "profiles"
COLLECTION_CONTENT = "web_content"

# Web scraping configuration
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
REQUEST_TIMEOUT = 30  # seconds
MAX_RETRIES = 3
RETRY_DELAY = 5  # seconds

# Content limits
MAX_TWEETS = 1000
MAX_PAGES_PER_SITE = 50
MAX_CONTENT_AGE_DAYS = 365  # 1 year

# Processing configuration
LANGUAGE = "en"
MIN_CONTENT_LENGTH = 50  # characters
