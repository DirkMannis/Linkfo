"""
Main data collector module that integrates all data collection components.
"""
from . import config
from .twitter_connector import TwitterConnector
from .web_scraper import WebScraper
from .content_processor import ContentProcessor
from .database import Database

class DataCollector:
    """Main data collector that integrates all data collection components."""
    
    def __init__(self):
        """Initialize data collector."""
        self.twitter = TwitterConnector()
        self.scraper = WebScraper()
        self.processor = ContentProcessor()
        self.db = Database()
    
    def collect_twitter_data(self, username, user_id):
        """Collect Twitter data for a user."""
        print(f"Collecting Twitter data for {username}...")
        
        # Get user profile
        profile = self.twitter.get_user_profile(username)
        
        if not profile:
            print(f"Failed to get Twitter profile for {username}")
            return False
        
        # Save profile to database
        self.db.save_profile(profile, user_id)
        
        # Get user tweets
        tweets = self.twitter.get_user_tweets(
            username,
            count=config.MAX_TWEETS,
            days_back=config.MAX_CONTENT_AGE_DAYS
        )
        
        if not tweets:
            print(f"No tweets found for {username}")
            return False
        
        # Process tweets
        processed_tweets = self.processor.batch_process_tweets(tweets)
        
        # Save tweets to database
        self.db.save_tweets(tweets, user_id)
        
        print(f"Collected {len(tweets)} tweets for {username}")
        return True
    
    def collect_web_content(self, url, user_id):
        """Collect web content for a user."""
        print(f"Collecting web content from {url}...")
        
        # Check if URL is a blog
        is_blog = '/blog/' in url or 'blog.' in url
        
        if is_blog:
            # Get blog posts
            pages = self.scraper.get_blog_posts(
                url,
                max_posts=config.MAX_PAGES_PER_SITE
            )
        else:
            # Crawl website
            pages = self.scraper.crawl_website(
                url,
                max_pages=config.MAX_PAGES_PER_SITE
            )
        
        if not pages:
            print(f"No content found at {url}")
            return False
        
        # Process web content
        processed_pages = self.processor.batch_process_web_content(pages)
        
        # Save web content to database
        for page in pages:
            self.db.save_web_content(page, user_id)
        
        print(f"Collected {len(pages)} pages from {url}")
        return True
    
    def collect_all_data(self, user_id, sources):
        """Collect all data for a user from multiple sources."""
        results = {
            'twitter': False,
            'web': False,
            'total_items': 0
        }
        
        # Collect Twitter data if available
        twitter_username = sources.get('twitter_username')
        if twitter_username:
            results['twitter'] = self.collect_twitter_data(twitter_username, user_id)
        
        # Collect web content if available
        website_url = sources.get('website_url')
        if website_url:
            results['web'] = self.collect_web_content(website_url, user_id)
        
        # Get total collected items
        tweets = self.db.get_tweets(user_id)
        web_content = self.db.get_web_content(user_id)
        
        results['total_items'] = len(tweets) + len(web_content)
        
        return results
