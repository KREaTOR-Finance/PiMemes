const express = require('express');
const router = express.Router();
const { addLiquidity, removeLiquidity, getUserLiquidityPositions, getAllLiquidityPools } = require('../controllers/liquidityController');
const auth = require('../middleware/auth');

// Add liquidity (protected route)
router.post('/add', auth, addLiquidity);

// Remove liquidity (protected route)
router.post('/remove', auth, removeLiquidity);

// Get user's liquidity positions (protected route)
router.get('/positions', auth, getUserLiquidityPositions);

// Get all liquidity pools
router.get('/pools', getAllLiquidityPools);

module.exports = router; 