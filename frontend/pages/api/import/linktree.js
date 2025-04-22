export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ message: 'Linktree username is required' });
    }
    
    console.log(`Processing Linktree import for username: ${username}`);
    
    // For now, we'll use mock data regardless of the username provided
    // In a production environment, you would implement web scraping here
    const mockLinktreeData = {
      username: username,
      profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Content creator and digital entrepreneur',
      links: [
        { title: 'My Website', url: 'https://example.com', id: '1' },
        { title: 'YouTube Channel', url: 'https://youtube.com/c/example', id: '2' },
        { title: 'Instagram', url: 'https://instagram.com/example', id: '3' },
        { title: 'Twitter', url: 'https://twitter.com/example', id: '4' },
        { title: 'Buy Me a Coffee', url: 'https://buymeacoffee.com/example', id: '5' }
      ]
    };
    
    // Add some specific links if the username is crypto.banter
    if (username.toLowerCase()  === 'crypto.banter') {
      mockLinktreeData.links = [
        { title: 'YouTube Channel', url: 'https://youtube.com/c/cryptobanter', id: '1' },
        { title: 'Twitter', url: 'https://twitter.com/cryptobanter', id: '2' },
        { title: 'Telegram', url: 'https://t.me/cryptobanter', id: '3' },
        { title: 'Website', url: 'https://cryptobanter.com', id: '4' },
        { title: 'Discord', url: 'https://discord.gg/cryptobanter', id: '5' }
      ];
      mockLinktreeData.bio = 'Crypto news and analysis';
    }
    
    console.log('Returning mock data:', mockLinktreeData) ;
    
    return res.status(200).json({
      success: true,
      data: mockLinktreeData
    });
  } catch (error) {
    console.error('Linktree import error:', error);
    return res.status(500).json({ message: 'Error importing from Linktree' });
  }
}
