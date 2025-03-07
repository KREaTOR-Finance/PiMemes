const express = require('express');
const router = express.Router();
const { getUserWallet, sendPI, sendTokens, getTransactionHistory } = require('../controllers/walletController');
const auth = require('../middleware/auth');

// Get user wallet (protected route)
router.get('/', auth, getUserWallet);

// Send PI to another user (protected route)
router.post('/send-pi', auth, sendPI);

// Send tokens to another user (protected route)
router.post('/send-tokens', auth, sendTokens);

// Get transaction history (protected route)
router.get('/transactions', auth, getTransactionHistory);

module.exports = router; 