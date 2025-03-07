const express = require('express');
const router = express.Router();
const { executeTrade, getRecentTrades, getUserTrades } = require('../controllers/tradeController');
const auth = require('../middleware/auth');

// Execute a trade (protected route)
router.post('/execute', auth, executeTrade);

// Get recent trades
router.get('/recent', getRecentTrades);

// Get recent trades for a specific token
router.get('/recent/:token_id', getRecentTrades);

// Get user's trades (protected route)
router.get('/user', auth, getUserTrades);

module.exports = router; 