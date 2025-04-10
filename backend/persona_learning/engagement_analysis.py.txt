"""
Engagement analysis module for analyzing user interaction patterns.
"""
from collections import Counter
import re
import statistics
from datetime import datetime, timedelta
from . import config

class EngagementAnalyzer:
    """Engagement analyzer for analyzing user interaction patterns."""
    
    def __init__(self):
        """Initialize engagement analyzer."""
        pass
    
    def analyze_posting_patterns(self, tweets):
        """Analyze posting patterns from tweets."""
        if not tweets:
            return None
        
        # Extract timestamps
        timestamps = []
        for tweet in tweets:
            try:
                # Convert ISO format to datetime
                timestamp = datetime.fromisoformat(tweet['created_at'].replace('Z', '+00:00'))
                timestamps.append(timestamp)
            except (ValueError, KeyError):
                continue
        
        if not timestamps:
            return None
        
        # Sort timestamps
        timestamps.sort()
        
        # Calculate time differences between posts
        time_diffs = []
        for i in range(1, len(timestamps)):
            diff = timestamps[i] - timestamps[i-1]
            time_diffs.append(diff.total_seconds() / 3600)  # Convert to hours
        
        # Calculate posting frequency
        if time_diffs:
            avg_time_between_posts = statistics.mean(time_diffs)
            posts_per_day = 24 / avg_time_between_posts if avg_time_between_posts > 0 else 0
        else:
            avg_time_between_posts = 0
            posts_per_day = 0
        
        # Analyze posting times
        hour_counts = Counter([ts.hour for ts in timestamps])
        day_counts = Counter([ts.weekday() for ts in timestamps])
        
        # Find peak posting times
        peak_hour = hour_counts.most_common(1)[0][0] if hour_counts else None
        peak_day = day_counts.most_common(1)[0][0] if day_counts else None
        
        # Map weekday number to name
        day_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        peak_day_name = day_names[peak_day] if peak_day is not None else None
        
        return {
            'posts_per_day': posts_per_day,
            'avg_time_between_posts': avg_time_between_posts,
            'peak_hour': peak_hour,
            'peak_day': peak_day_name,
            'hour_distribution': dict(hour_counts),
            'day_distribution': {day_names[day]: count for day, count in day_counts.items()}
        }
    
    def analyze_engagement_metrics(self, tweets):
        """Analyze engagement metrics from tweets."""
        if not tweets:
            return None
        
        # Extract engagement metrics
        likes = []
        retweets = []
        
        for tweet in tweets:
            try:
                likes.append(tweet['favorite_count'])
                retweets.append(tweet['retweet_count'])
            except KeyError:
                continue
        
        if not likes or not retweets:
            return None
        
        # Calculate engagement statistics
        avg_likes = statistics.mean(likes) if likes else 0
        avg_retweets = statistics.mean(retweets) if retweets else 0
        max_likes = max(likes) if likes else 0
        max_retweets = max(retweets) if retweets else 0
        
        # Calculate engagement rate
        engagement_rate = (sum(likes) + sum(retweets)) / (len(tweets) * 100) if tweets else 0
        
        return {
            'avg_likes': avg_likes,
            'avg_retweets': avg_retweets,
            'max_likes': max_likes,
            'max_retweets': max_retweets,
            'engagement_rate': engagement_rate
        }
    
    def analyze_interaction_patterns(self, tweets):
        """Analyze interaction patterns from tweets."""
        if not tweets:
            return None
        
        # Count replies, retweets, and original tweets
        replies = 0
        retweets = 0
        original = 0
        
        for tweet in tweets:
            try:
                if tweet['is_reply']:
                    replies += 1
                elif tweet['is_retweet']:
                    retweets += 1
                else:
                    original += 1
            except KeyError:
                continue
        
        total = replies + retweets + original
        
        # Calculate percentages
        if total > 0:
            reply_pct = replies / total
            retweet_pct = retweets / total
            original_pct = original / total
        else:
            reply_pct = retweet_pct = original_pct = 0
        
        # Determine interaction style
        if reply_pct > 0.5:
            interaction_style = 'conversational'
        elif retweet_pct > 0.5:
            interaction_style = 'curator'
        elif original_pct > 0.7:
            interaction_style = 'broadcaster'
        else:
            interaction_style = 'balanced'
        
        return {
            'reply_count': replies,
            'retweet_count': retweets,
            'original_count': original,
            'reply_percentage': reply_pct,
            'retweet_percentage': retweet_pct,
            'original_percentage': original_pct,
            'interaction_style': interaction_style
        }
    
    def analyze_question_handling(self, tweets):
        """Analyze how the user handles questions in their tweets."""
        if not tweets:
            return None
        
        # Count tweets with questions
        question_tweets = 0
        question_marks = 0
        
        for tweet in tweets:
            try:
                text = tweet['full_text']
                if '?' in text:
                    question_tweets += 1
                    question_marks += text.count('?')
            except KeyError:
                continue
        
        # Calculate question frequency
        question_frequency = question_tweets / len(tweets) if tweets else 0
        
        # Determine question handling style
        if question_frequency > 0.3:
            question_style = 'inquisitive'
        elif question_frequency > 0.1:
            question_style = 'balanced'
        else:
            question_style = 'declarative'
        
        return {
            'question_tweets': question_tweets,
            'question_marks': question_marks,
            'question_frequency': question_frequency,
            'question_style': question_style
        }
    
    def analyze_hashtag_usage(self, tweets):
        """Analyze hashtag usage patterns."""
        if not tweets:
            return None
        
        # Extract hashtags
        all_hashtags = []
        
        for tweet in tweets:
            try:
                hashtags = tweet['hashtags']
                all_hashtags.extend(hashtags)
            except KeyError:
                continue
        
        # Count hashtag frequency
        hashtag_counts = Counter(all_hashtags)
        
        # Calculate hashtag statistics
        total_hashtags = len(all_hashtags)
        unique_hashtags = len(hashtag_counts)
        avg_hashtags_per_tweet = total_hashtags / len(tweets) if tweets else 0
        
        # Get top hashtags
        top_hashtags = hashtag_counts.most_common(10)
        
        return {
            'total_hashtags': total_hashtags,
            'unique_hashtags': unique_hashtags,
            'avg_hashtags_per_tweet': avg_hashtags_per_tweet,
            'top_hashtags': top_hashtags,
            'hashtag_frequency': dict(hashtag_counts)
        }
    
    def analyze_all_engagement(self, tweets):
        """Analyze all engagement aspects from tweets."""
        if not tweets:
            return None
        
        return {
            'posting_patterns': self.analyze_posting_patterns(tweets),
            'engagement_metrics': self.analyze_engagement_metrics(tweets),
            'interaction_patterns': self.analyze_interaction_patterns(tweets),
            'question_handling': self.analyze_question_handling(tweets),
            'hashtag_usage': self.analyze_hashtag_usage(tweets)
        }
