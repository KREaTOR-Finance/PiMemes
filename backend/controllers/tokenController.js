const supabase = require('../config/supabase');

// Mock tokens for testing
const mockTokens = [
  {
    id: '1',
    name: 'DOGEPI',
    symbol: 'DOGEPI',
    supply: 1000000000,
    minting: true,
    marketing_tax: 2,
    liquidity_tax: 2,
    dev_tax: 1,
    creator_wallet: '0xtest',
    creator_allocation: 10,
    initial_liquidity: 1000,
    price: 0.0001,
    market_cap: 100000,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'MOONPI',
    symbol: 'MOONPI',
    supply: 2000000000,
    minting: false,
    marketing_tax: 3,
    liquidity_tax: 3,
    dev_tax: 2,
    creator_wallet: '0xtest2',
    creator_allocation: 15,
    initial_liquidity: 2000,
    price: 0.0002,
    market_cap: 400000,
    created_at: new Date().toISOString()
  }
];

// Create a new meme coin
exports.createMemeCoin = async (req, res) => {
  try {
    const { 
      name, 
      symbol,
      supply, 
      minting, 
      marketingTax, 
      liquidityTax, 
      devTax, 
      creatorWallet, 
      creatorAllocation, 
      initialLiquidity 
    } = req.body;

    // Validate required fields
    if (!name || !symbol || !supply || !creatorWallet) {
      return res.status(400).json({ 
        error: "Name, symbol, supply, and creator wallet are required fields." 
      });
    }

    // Validate tax percentages
    const totalTax = Number(marketingTax || 0) + Number(liquidityTax || 0) + Number(devTax || 0);
    if (totalTax > 49) {
      return res.status(400).json({ 
        error: "Total tax must be 49% or lower." 
      });
    }

    // Validate creator allocation
    if (Number(creatorAllocation) > 30) {
      return res.status(400).json({ 
        error: "Creator allocation cannot exceed 30%." 
      });
    }

    // For testing, just return success
    const newToken = {
      id: Date.now().toString(),
      name,
      symbol: symbol.toUpperCase(),
      supply: Number(supply),
      minting: Boolean(minting),
      marketing_tax: Number(marketingTax || 0),
      liquidity_tax: Number(liquidityTax || 0),
      dev_tax: Number(devTax || 0),
      creator_wallet: creatorWallet,
      creator_allocation: Number(creatorAllocation || 0),
      initial_liquidity: Number(initialLiquidity || 0),
      price: 0.0001,
      market_cap: Number(supply) * 0.0001,
      created_at: new Date().toISOString()
    };

    // Add to mock tokens
    mockTokens.push(newToken);

    res.status(201).json({ 
      message: "Token Created Successfully!", 
      token: newToken
    });
  } catch (error) {
    console.error("Error creating token:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get all tokens
exports.getAllTokens = async (req, res) => {
  try {
    // For testing, return mock tokens
    res.json(mockTokens);
  } catch (error) {
    console.error("Error fetching tokens:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get token by ID
exports.getTokenById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // For testing, find in mock tokens
    const token = mockTokens.find(t => t.id === id);
    
    if (!token) {
      return res.status(404).json({ error: "Token not found" });
    }
    
    res.json(token);
  } catch (error) {
    console.error("Error fetching token:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get token price history
exports.getTokenPriceHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // For testing, generate mock price history
    const token = mockTokens.find(t => t.id === id);
    
    if (!token) {
      return res.status(404).json({ error: "Token not found" });
    }
    
    const priceHistory = [];
    const now = new Date();
    
    // Generate 100 price points over the last 30 days
    for (let i = 0; i < 100; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (30 * i / 100));
      
      // Random price fluctuation around the current price
      const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
      const price = token.price * randomFactor;
      
      priceHistory.push({
        price,
        timestamp: date.toISOString()
      });
    }
    
    res.json(priceHistory.reverse());
  } catch (error) {
    console.error("Error fetching token price history:", error);
    res.status(500).json({ error: "Server Error" });
  }
}; 