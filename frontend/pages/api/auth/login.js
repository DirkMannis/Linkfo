export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Mock user data for prototype
    // In a real app, you would verify against a database
    const user = {
      id: '1',
      email: 'user@example.com',
      password: 'password123', // In a real app, this would be hashed
      name: 'Alex Johnson',
      bio: 'AI researcher and technology enthusiast',
      profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
    };
    
    // Check if user exists and password matches
    if (email !== user.email || password !== user.password)  {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    // In a real app, you would use a proper JWT library
    const token = 'mock-jwt-token';
    
    // Return success response
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        bio: user.bio,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
