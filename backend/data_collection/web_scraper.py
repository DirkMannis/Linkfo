"""
Web scraper for collecting content from websites and blogs.
"""
import requests
from bs4 import BeautifulSoup
import time
import re
from urllib.parse import urljoin, urlparse
from . import config

class WebScraper:
    """Web scraper for collecting content from websites and blogs."""
    
    def __init__(self):
        """Initialize web scraper."""
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': config.USER_AGENT
        })
    
    def get_page_content(self, url):
        """Get content from a single web page."""
        try:
            response = self.session.get(
                url,
                timeout=config.REQUEST_TIMEOUT
            )
            response.raise_for_status()
            
            # Parse HTML
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract title
            title = soup.title.string if soup.title else ''
            
            # Extract meta description
            meta_desc = ''
            meta_tag = soup.find('meta', attrs={'name': 'description'})
            if meta_tag and 'content' in meta_tag.attrs:
                meta_desc = meta_tag['content']
            
            # Extract main content
            # This is a simplified approach; real implementation would be more sophisticated
            content = ''
            
            # Try to find main content container
            main_content = soup.find('main') or soup.find('article') or soup.find('div', class_=re.compile(r'content|main|post'))
            
            if main_content:
                # Remove script and style elements
                for script in main_content(['script', 'style', 'nav', 'footer', 'header']):
                    script.decompose()
                
                # Get text
                content = main_content.get_text(separator=' ', strip=True)
            else:
                # Fallback to body content
                body = soup.find('body')
                if body:
                    # Remove script and style elements
                    for script in body(['script', 'style', 'nav', 'footer', 'header']):
                        script.decompose()
                    
                    # Get text
                    content = body.get_text(separator=' ', strip=True)
            
            # Clean up content
            content = re.sub(r'\s+', ' ', content).strip()
            
            # Extract links
            links = []
            for a in soup.find_all('a', href=True):
                href = a['href']
                if href.startswith('http')  or href.startswith('www'):
                    links.append(href)
                elif not href.startswith('#') and not href.startswith('javascript:'):
                    # Convert relative URL to absolute
                    links.append(urljoin(url, href))
            
            # Extract images
            images = []
            for img in soup.find_all('img', src=True):
                src = img['src']
                if src.startswith('http')  or src.startswith('www'):
                    images.append(src)
                else:
                    # Convert relative URL to absolute
                    images.append(urljoin(url, src))
            
            # Create page data
            page_data = {
                'url': url,
                'title': title,
                'description': meta_desc,
                'content': content,
                'links': links,
                'images': images,
                'html': response.text
            }
            
            return page_data
        
        except Exception as e:
            print(f"Error scraping {url}: {str(e)}")
            return None
    
    def crawl_website(self, start_url, max_pages=10):
        """Crawl a website starting from a URL."""
        visited = set()
        to_visit = [start_url]
        pages = []
        
        # Extract domain to stay on the same site
        domain = urlparse(start_url).netloc
        
        while to_visit and len(pages) < max_pages:
            # Get next URL to visit
            url = to_visit.pop(0)
            
            # Skip if already visited
            if url in visited:
                continue
            
            # Mark as visited
            visited.add(url)
            
            # Get page content
            page_data = self.get_page_content(url)
            
            if page_data:
                # Add to pages
                pages.append(page_data)
                
                # Add links to visit queue
                for link in page_data['links']:
                    # Only add links from the same domain
                    if urlparse(link).netloc == domain and link not in visited:
                        to_visit.append(link)
            
            # Respect robots.txt (simplified)
            time.sleep(1)
        
        return pages
    
    def get_blog_posts(self, blog_url, max_posts=10):
        """Get blog posts from a blog URL."""
        # First, crawl the blog
        pages = self.crawl_website(blog_url, max_pages=max_posts * 2)
        
        # Filter for likely blog post pages
        blog_posts = []
        
        for page in pages:
            # Check if page looks like a blog post
            is_post = False
            
            # Check URL pattern
            url_path = urlparse(page['url']).path
            if re.search(r'/\d{4}/\d{2}/|/blog/|/post/|/article/', url_path):
                is_post = True
            
            # Check content length
            if len(page['content']) > config.MIN_CONTENT_LENGTH:
                is_post = True
            
            if is_post:
                blog_posts.append(page)
                
                # Stop if we have enough posts
                if len(blog_posts) >= max_posts:
                    break
        
        return blog_posts
