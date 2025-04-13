# backend/scripts/import_linktree.py

import sys
import json
import os
import sys

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from data_collection.linktree_scraper import LinktreeScraper

def main():
    """Main function to import Linktree profile."""
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Username is required"}))
        sys.exit(1)
    
    username = sys.argv[1]
    
    # Create scraper
    scraper = LinktreeScraper()
    
    # Extract profile
    profile = scraper.extract_profile(username)
    
    if not profile:
        print(json.dumps({"error": f"Failed to extract profile for {username}"}))
        sys.exit(1)
    
    # Output profile as JSON
    print(json.dumps(profile))
    sys.exit(0)

if __name__ == "__main__":
    main()
