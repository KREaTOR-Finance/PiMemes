const express = require('express');
const router = express.Router();
const { signup, login, getCurrentUser } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register a new user
router.post('/signup', signup);

// Login user
router.post('/login', login);

// Get current user (protected route)
router.get('/me', auth, getCurrentUser);

module.exports = router; 