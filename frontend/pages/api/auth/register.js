export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Mock user data for prototype
    // In a real app, you would store this in a database
    const newUser = {
      id: '1',
      email,
      name,
      bio: '',
      profileImage: 'https://randomuser.me/api/portraits/lego/1.jpg'
    };
    
    // Generate JWT token
    // In a real app, you would use a proper JWT library
    const token = 'mock-jwt-token';
    
    // Return success response
    return res.status(201) .json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        bio: newUser.bio,
        profileImage: newUser.profileImage
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
