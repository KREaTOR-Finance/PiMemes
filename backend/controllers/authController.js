const supabase = require('../config/supabase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock JWT secret for testing
const JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';

// Register a new user
exports.signup = async (req, res) => {
  try {
    const { username, email, password, pi_wallet_address } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide username, email and password' });
    }
    
    // For testing, always succeed
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        username, 
        email, 
        password_hash: hashedPassword, 
        pi_wallet_address,
        created_at: new Date().toISOString(),
        pi_balance: 1000 // Give new users some test PI
      }])
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(201).json({ 
      message: 'User registered successfully!',
      user: {
        id: data[0].id,
        username: data[0].username,
        email: data[0].email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }
    
    // For testing, if email is test@example.com, return mock data
    if (email === 'test@example.com' && password === 'password123') {
      const token = jwt.sign(
        { id: '123', username: 'testuser' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          pi_wallet_address: '0xtest',
          pi_balance: 1000
        }
      });
    }
    
    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        pi_wallet_address: user.pi_wallet_address,
        pi_balance: user.pi_balance
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    res.json({
      user: req.user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}; 