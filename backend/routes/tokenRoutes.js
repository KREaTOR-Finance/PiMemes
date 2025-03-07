const express = require("express");
const router = express.Router();
const { createMemeCoin, getAllTokens, getTokenById, getTokenPriceHistory } = require("../controllers/tokenController");
const auth = require('../middleware/auth');

// Create a new token (protected route)
router.post("/create", auth, createMemeCoin);

// Get all tokens
router.get("/list", getAllTokens);

// Get a specific token by ID
router.get("/:id", getTokenById);

// Get token price history
router.get("/:id/price-history", getTokenPriceHistory);

module.exports = router; 