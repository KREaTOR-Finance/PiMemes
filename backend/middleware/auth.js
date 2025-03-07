const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

// Mock JWT secret for testing
const JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // For testing purposes, if token is 'test_token', use mock user
    if (token === 'test_token') {
      req.user = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        pi_wallet_address: '0xtest'
      };
      return next();
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Check if user exists
      const { data: user, error } = await supabase
        .from('users')
        .select('id, username, email, pi_wallet_address')
        .eq('id', decoded.id)
        .single();
      
      if (error || !user) {
        return res.status(401).json({ error: 'Token is not valid' });
      }
      
      // Add user to request object
      req.user = user;
      next();
    } catch (err) {
      console.error('JWT verification error:', err.message);
      return res.status(401).json({ error: 'Token is not valid' });
    }
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ error: 'Token is not valid' });
  }
}; 