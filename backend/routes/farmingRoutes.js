const express = require('express');
const router = express.Router();
const { getAllFarmingPools, stakeLPTokens, unstakeLPTokens, harvestRewards, getUserFarmingPositions } = require('../controllers/farmingController');
const auth = require('../middleware/auth');

// Get all farming pools
router.get('/pools', getAllFarmingPools);

// Stake LP tokens (protected route)
router.post('/stake', auth, stakeLPTokens);

// Unstake LP tokens (protected route)
router.post('/unstake', auth, unstakeLPTokens);

// Harvest rewards (protected route)
router.post('/harvest', auth, harvestRewards);

// Get user's farming positions (protected route)
router.get('/positions', auth, getUserFarmingPositions);

module.exports = router; 