/**
 * Calculate price based on AMM formula (x * y = k)
 * @param {number} piReserve - PI reserve in the liquidity pool
 * @param {number} tokenReserve - Token reserve in the liquidity pool
 * @param {number} amount - Amount of tokens to buy/sell
 * @param {string} type - 'buy' or 'sell'
 * @returns {number} - Price per token
 */
exports.calculatePrice = (piReserve, tokenReserve, amount, type) => {
  // Constant product formula: x * y = k
  const k = piReserve * tokenReserve;
  
  if (type === 'buy') {
    // When buying tokens, PI reserve increases and token reserve decreases
    // New token reserve: tokenReserve - amount
    // New PI reserve: k / (tokenReserve - amount)
    // PI needed: newPiReserve - piReserve
    // Price per token: piNeeded / amount
    const newTokenReserve = tokenReserve - amount;
    if (newTokenReserve <= 0) {
      throw new Error('Insufficient liquidity');
    }
    
    const newPiReserve = k / newTokenReserve;
    const piNeeded = newPiReserve - piReserve;
    return piNeeded / amount;
  } else {
    // When selling tokens, PI reserve decreases and token reserve increases
    // New token reserve: tokenReserve + amount
    // New PI reserve: k / (tokenReserve + amount)
    // PI received: piReserve - newPiReserve
    // Price per token: piReceived / amount
    const newTokenReserve = tokenReserve + amount;
    const newPiReserve = k / newTokenReserve;
    const piReceived = piReserve - newPiReserve;
    return piReceived / amount;
  }
};

/**
 * Calculate slippage for a trade
 * @param {number} piReserve - PI reserve in the liquidity pool
 * @param {number} tokenReserve - Token reserve in the liquidity pool
 * @param {number} amount - Amount of tokens to buy/sell
 * @param {string} type - 'buy' or 'sell'
 * @returns {number} - Slippage percentage
 */
exports.calculateSlippage = (piReserve, tokenReserve, amount, type) => {
  // Current price: piReserve / tokenReserve
  const currentPrice = piReserve / tokenReserve;
  
  // Calculate execution price
  const executionPrice = this.calculatePrice(piReserve, tokenReserve, amount, type);
  
  // Calculate slippage
  if (type === 'buy') {
    // When buying, execution price is higher than current price
    return ((executionPrice - currentPrice) / currentPrice) * 100;
  } else {
    // When selling, execution price is lower than current price
    return ((currentPrice - executionPrice) / currentPrice) * 100;
  }
};

/**
 * Calculate fees for a trade
 * @param {number} amount - Amount of tokens
 * @param {number} price - Price per token
 * @param {number} marketingTax - Marketing tax percentage
 * @param {number} liquidityTax - Liquidity tax percentage
 * @param {number} devTax - Developer tax percentage
 * @returns {Object} - Fee breakdown
 */
exports.calculateFees = (amount, price, marketingTax, liquidityTax, devTax) => {
  const totalValue = amount * price;
  
  const marketingFee = totalValue * (marketingTax / 100);
  const liquidityFee = totalValue * (liquidityTax / 100);
  const devFee = totalValue * (devTax / 100);
  
  const totalFee = marketingFee + liquidityFee + devFee;
  
  return {
    marketingFee,
    liquidityFee,
    devFee,
    totalFee
  };
}; 