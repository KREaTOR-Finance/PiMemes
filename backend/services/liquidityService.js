const supabase = require('../config/supabase');

/**
 * Calculate LP tokens to mint when adding liquidity
 * @param {number} piAmount - Amount of PI being added
 * @param {number} tokenAmount - Amount of tokens being added
 * @param {number} piReserve - Current PI reserve in the pool
 * @param {number} tokenReserve - Current token reserve in the pool
 * @param {number} lpTokenSupply - Current LP token supply
 * @returns {number} - LP tokens to mint
 */
exports.calculateLPTokens = (piAmount, tokenAmount, piReserve, tokenReserve, lpTokenSupply) => {
  // If this is the first liquidity provision, LP tokens = PI amount
  if (piReserve === 0 && tokenReserve === 0) {
    return piAmount;
  }
  
  // Calculate the proportion of the pool being added
  // Use the smaller of the two proportions to prevent manipulation
  const piProportion = piAmount / piReserve;
  const tokenProportion = tokenAmount / tokenReserve;
  
  const proportion = Math.min(piProportion, tokenProportion);
  
  // Calculate LP tokens to mint
  return proportion * lpTokenSupply;
};

/**
 * Calculate token amount needed for a given PI amount
 * @param {number} piAmount - Amount of PI
 * @param {number} piReserve - Current PI reserve in the pool
 * @param {number} tokenReserve - Current token reserve in the pool
 * @returns {number} - Token amount needed
 */
exports.calculateTokenAmount = (piAmount, piReserve, tokenReserve) => {
  // If this is the first liquidity provision, use a fixed ratio
  if (piReserve === 0 && tokenReserve === 0) {
    // For example, 1 PI = 1000 tokens
    return piAmount * 1000;
  }
  
  // Calculate token amount based on current ratio
  return (piAmount * tokenReserve) / piReserve;
};

/**
 * Create a new liquidity pool
 * @param {string} tokenId - Token ID
 * @param {string} creatorWallet - Creator's wallet address
 * @param {number} piAmount - Initial PI amount
 * @param {number} tokenAmount - Initial token amount
 * @returns {Object} - Created pool
 */
exports.createLiquidityPool = async (tokenId, creatorWallet, piAmount, tokenAmount) => {
  try {
    // Create the pool
    const { data: pool, error } = await supabase
      .from('liquidity_pools')
      .insert([{
        token_id: tokenId,
        pi_reserve: piAmount,
        token_reserve: tokenAmount,
        lp_token_supply: piAmount, // Initial LP token supply equals PI amount
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();
    
    if (error) {
      throw new Error(`Failed to create liquidity pool: ${error.message}`);
    }
    
    // Get user ID from wallet address
    const { data: wallet } = await supabase
      .from('wallets')
      .select('user_id')
      .eq('wallet_address', creatorWallet)
      .single();
    
    if (wallet) {
      // Create LP token for the creator
      await supabase
        .from('lp_tokens')
        .insert([{
          user_id: wallet.user_id,
          pool_id: pool[0].id,
          token_id: tokenId,
          amount: piAmount, // Initial LP tokens equals PI amount
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
      
      // Record the liquidity addition
      await supabase
        .from('liquidity_transactions')
        .insert([{
          user_id: wallet.user_id,
          pool_id: pool[0].id,
          type: 'add',
          pi_amount: piAmount,
          token_amount: tokenAmount,
          lp_tokens: piAmount,
          timestamp: new Date().toISOString()
        }]);
    }
    
    return pool[0];
  } catch (error) {
    console.error('Create liquidity pool error:', error);
    throw error;
  }
}; 