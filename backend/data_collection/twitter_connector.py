"""
Twitter API connector for collecting tweets and profile information.
"""
import tweepy
import time
from datetime import datetime, timedelta
from . import config

class TwitterConnector:
    """Twitter API connector for data collection."""
    
    def __init__(self):
        """Initialize Twitter API connection."""
        self.api = None
        self.connected = False
    
    def connect(self):
        """Connect to Twitter API."""
        try:
            auth = tweepy.OAuthHandler(
                config.TWITTER_API_KEY,
                config.TWITTER_API_SECRET
            )
            auth.set_access_token(
                config.TWITTER_ACCESS_TOKEN,
                config.TWITTER_ACCESS_SECRET
            )
            
            self.api = tweepy.API(auth, wait_on_rate_limit=True)
            self.api.verify_credentials()
            self.connected = True
            print("Connected to Twitter API")
            return True
        except Exception as e:
            print(f"Error connecting to Twitter API: {str(e)}")
            self.connected = False
            return False
    
    def get_user_profile(self, username):
        """Get Twitter user profile."""
        if not self.connected:
            if not self.connect():
                return None
        
        try:
            user = self.api.get_user(screen_name=username)
            
            profile = {
                'platform': 'twitter',
                'platform_id': user.id_str,
                'username': user.screen_name,
                'name': user.name,
                'description': user.description,
                'location': user.location,
                'url': user.url,
                'followers_count': user.followers_count,
                'friends_count': user.friends_count,
                'statuses_count': user.statuses_count,
                'profile_image_url': user.profile_image_url_https,
                'created_at': user.created_at.isoformat() 
            }
            
            return profile
        except Exception as e:
            print(f"Error getting Twitter profile for {username}: {str(e)}")
            return None
    
    def get_user_tweets(self, username, count=200, days_back=30):
        """Get tweets from a user."""
        if not self.connected:
            if not self.connect():
                return []
        
        tweets = []
        max_id = None
        oldest_allowed = datetime.now() - timedelta(days=days_back)
        
        try:
            # Make multiple requests to get more tweets
            for _ in range(count // 200 + 1):
                batch = self.api.user_timeline(
                    screen_name=username,
                    count=min(200, count - len(tweets)),
                    tweet_mode='extended',
                    max_id=max_id
                )
                
                if not batch:
                    break
                
                for tweet in batch:
                    # Skip if tweet is older than allowed
                    if tweet.created_at < oldest_allowed:
                        continue
                    
                    # Process tweet
                    tweet_data = {
                        'id_str': tweet.id_str,
                        'created_at': tweet.created_at.isoformat(),
                        'full_text': tweet.full_text,
                        'retweet_count': tweet.retweet_count,
                        'favorite_count': tweet.favorite_count,
                        'hashtags': [h['text'] for h in tweet.entities.get('hashtags', [])],
                        'urls': [u['expanded_url'] for u in tweet.entities.get('urls', [])],
                        'mentions': [m['screen_name'] for m in tweet.entities.get('user_mentions', [])],
                        'is_retweet': hasattr(tweet, 'retweeted_status'),
                        'is_reply': tweet.in_reply_to_status_id is not None
                    }
                    
                    # Add media if available
                    if hasattr(tweet, 'extended_entities') and 'media' in tweet.extended_entities:
                        tweet_data['media'] = [
                            {
                                'type': m['type'],
                                'url': m['media_url_https']
                            }
                            for m in tweet.extended_entities['media']
                        ]
                    
                    tweets.append(tweet_data) 
                
                # Update max_id for pagination
                max_id = batch[-1].id - 1
                
                # Check if we have enough tweets
                if len(tweets) >= count:
                    break
                
                # Respect rate limits
                time.sleep(1)
        
        except Exception as e:
            print(f"Error getting tweets for {username}: {str(e)}")
        
        return tweets[:count]
    
    def get_user_engagement(self, username, count=100):
        """Get engagement metrics for a user's tweets."""
        if not self.connected:
            if not self.connect():
                return None
        
        try:
            tweets = self.get_user_tweets(username, count=count)
            
            if not tweets:
                return None
            
            # Calculate engagement metrics
            total_retweets = sum(t['retweet_count'] for t in tweets)
            total_likes = sum(t['favorite_count'] for t in tweets)
            total_tweets = len(tweets)
            
            engagement = {
                'username': username,
                'tweet_count': total_tweets,
                'total_retweets': total_retweets,
                'total_likes': total_likes,
                'avg_retweets': total_retweets / total_tweets if total_tweets > 0 else 0,
                'avg_likes': total_likes / total_tweets if total_tweets > 0 else 0,
                'engagement_rate': (total_retweets + total_likes) / total_tweets if total_tweets > 0 else 0
            }
            
            return engagement
        except Exception as e:
            print(f"Error getting engagement for {username}: {str(e)}")
            return None
