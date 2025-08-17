// frontend/pages/api/auth/register.js

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

    // Check if user already exists (mock example)
    const userExists = false; // Replace this with actual user check logic

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user (mock example)
    const newUser = {
      id: String(Date.now()), // Generate a unique ID
      email,
      name,
      password, // In a real app, make sure to hash this
      bio: '',
      profileImage: 'https://randomuser.me/api/portraits/lego/1.jpg'
    };

    // Mock user storage, replace with actual DB logic
    const users = {}; // Replace with your user storage mechanism
    users[newUser.id] = newUser;

    // Generate JWT token (mock example)
    const token = 'mock-jwt-token'; // Replace with actual token generation logic

    // Return success response
    return res.status(201).json({
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