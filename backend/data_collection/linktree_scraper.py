# backend/data_collection/linktree_scraper.py

import requests
from bs4 import BeautifulSoup
import re
import json
from urllib.parse import urlparse

class LinktreeScraper:
    """Specialized scraper for Linktree pages."""
    
    def __init__(self):
        """Initialize Linktree scraper."""
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    def extract_profile(self, username):
        """Extract profile data from a Linktree page."""
        url = f"https://linktr.ee/{username}"
        
        try:
            response = self.session.get(url, timeout=30) 
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract profile data
            profile = {
                'username': username,
                'source': 'linktree',
                'source_url': url
            }
            
            # Extract profile name
            name_elem = soup.select_one('h1')
            if name_elem:
                profile['name'] = name_elem.text.strip()
            
            # Extract bio/description
            bio_elem = soup.select_one('div[data-testid="ProfileBio"]')
            if bio_elem:
                profile['bio'] = bio_elem.text.strip()
            
            # Extract profile image
            img_elem = soup.select_one('img[alt*="profile"]')
            if img_elem and 'src' in img_elem.attrs:
                profile['profile_image'] = img_elem['src']
            
            # Extract links
            links = []
            link_elements = soup.select('a[data-testid="LinkButton"]')
            
            for i, link_elem in enumerate(link_elements):
                link = {
                    'position': i + 1,
                    'url': link_elem['href']
                }
                
                # Extract title
                title_elem = link_elem.select_one('p')
                if title_elem:
                    link['title'] = title_elem.text.strip()
                else:
                    # Try to extract title from URL
                    parsed_url = urlparse(link['url'])
                    link['title'] = parsed_url.netloc.replace('www.', '')
                
                # Extract background color
                style = link_elem.get('style', '')
                bg_color_match = re.search(r'background-color:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\))', style)
                if bg_color_match:
                    link['color'] = bg_color_match.group(1)
                else:
                    link['color'] = '#0080FF'  # Default color
                
                # Determine icon based on URL
                link['icon'] = self._determine_icon(link['url'])
                
                links.append(link)
            
            profile['links'] = links
            
            return profile
            
        except Exception as e:
            print(f"Error scraping Linktree profile for {username}: {str(e)}")
            return None
    
    def _determine_icon(self, url):
        """Determine appropriate icon based on URL."""
        domain = urlparse(url).netloc.lower()
        
        if 'twitter.com' in domain or 'x.com' in domain:
            return 'FaTwitter'
        elif 'instagram.com' in domain:
            return 'FaInstagram'
        elif 'youtube.com' in domain or 'youtu.be' in domain:
            return 'FaYoutube'
        elif 'facebook.com' in domain or 'fb.me' in domain:
            return 'FaFacebook'
        elif 'linkedin.com' in domain:
            return 'FaLinkedin'
        elif 'github.com' in domain:
            return 'FaGithub'
        elif 'tiktok.com' in domain:
            return 'FaTiktok'
        elif 'spotify.com' in domain:
            return 'FaSpotify'
        elif 'apple.com' in domain or 'music.apple.com' in domain:
            return 'FaApple'
        elif 'medium.com' in domain:
            return 'FaMedium'
        elif 'twitch.tv' in domain:
            return 'FaTwitch'
        elif 'discord.gg' in domain or 'discord.com' in domain:
            return 'FaDiscord'
        elif 'patreon.com' in domain:
            return 'FaPatreon'
        elif 'snapchat.com' in domain:
            return 'FaSnapchat'
        elif 'pinterest.com' in domain:
            return 'FaPinterest'
        else:
            return 'FaLink'
