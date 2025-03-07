const supabase = require('../config/supabase');
const { calculateLPTokens, calculateTokenAmount } = require('../services/liquidityService');

// Add liquidity to a pool
exports.addLiquidity = async (req, res) => {
  try {
    const { token_id, pi_amount, token_amount } = req.body;
    const user_id = req.user.id;
    
    if (!token_id || !pi_amount || !token_amount) {
      return res.status(400).json({ error: 'Token ID, PI amount, and token amount are required' });
    }
    
    // Get token details
    const { data: token, error: tokenError } = await supabase
      .from('meme_coins')
      .select('*')
      .eq('id', token_id)
      .single();
    
    if (tokenError || !token) {
      return res.status(404).json({ error: 'Token not found' });
    }
    
    // Get user wallet
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user_id)
      .single();
    
    if (walletError || !wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    
    // Check if user has enough PI
    if (wallet.pi_balance < pi_amount) {
      return res.status(400).json({ error: 'Insufficient PI balance' });
    }
    
    // Check if user has enough tokens
    const { data: userToken } = await supabase
      .from('wallet_tokens')
      .select('*')
      .eq('wallet_id', wallet.id)
      .eq('token_id', token_id)
      .single();
    
    if (!userToken || userToken.balance < token_amount) {
      return res.status(400).json({ error: 'Insufficient token balance' });
    }
    
    // Check if liquidity pool exists
    let pool;
    const { data: existingPool, error: poolError } = await supabase
      .from('liquidity_pools')
      .select('*')
      .eq('token_id', token_id)
      .single();
    
    if (poolError) {
      // Create new liquidity pool
      const { data: newPool, error: createError } = await supabase
        .from('liquidity_pools')
        .insert([{
          token_id,
          pi_reserve: pi_amount,
          token_reserve: token_amount,
          lp_token_supply: pi_amount, // Initial LP token supply equals PI amount
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (createError) {
        return res.status(500).json({ error: createError.message });
      }
      
      pool = newPool[0];
    } else {
      pool = existingPool;
    }
    
    // Calculate LP tokens to mint
    const lpTokensToMint = calculateLPTokens(
      pi_amount,
      token_amount,
      pool.pi_reserve,
      pool.token_reserve,
      pool.lp_token_supply
    );
    
    // Update user's PI balance
    await supabase
      .from('wallets')
      .update({ pi_balance: wallet.pi_balance - pi_amount })
      .eq('id', wallet.id);
    
    // Update user's token balance
    await supabase
      .from('wallet_tokens')
      .update({ 
        balance: userToken.balance - token_amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', userToken.id);
    
    // Update liquidity pool
    await supabase
      .from('liquidity_pools')
      .update({
        pi_reserve: pool.pi_reserve + pi_amount,
        token_reserve: pool.token_reserve + token_amount,
        lp_token_supply: pool.lp_token_supply + lpTokensToMint,
        updated_at: new Date().toISOString()
      })
      .eq('id', pool.id);
    
    // Check if user has LP tokens for this pool
    const { data: userLPTokens } = await supabase
      .from('lp_tokens')
      .select('*')
      .eq('user_id', user_id)
      .eq('pool_id', pool.id)
      .single();
    
    if (userLPTokens) {
      // Update user's LP tokens
      await supabase
        .from('lp_tokens')
        .update({ 
          amount: userLPTokens.amount + lpTokensToMint,
          updated_at: new Date().toISOString()
        })
        .eq('id', userLPTokens.id);
    } else {
      // Create new LP token entry
      await supabase
        .from('lp_tokens')
        .insert([{
          user_id,
          pool_id: pool.id,
          token_id,
          amount: lpTokensToMint,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
    }
    
    // Record the liquidity addition
    await supabase
      .from('liquidity_transactions')
      .insert([{
        user_id,
        pool_id: pool.id,
        type: 'add',
        pi_amount,
        token_amount,
        lp_tokens: lpTokensToMint,
        timestamp: new Date().toISOString()
      }]);
    
    res.json({
      message: 'Liquidity added successfully',
      pi_amount,
      token_amount,
      lp_tokens: lpTokensToMint
    });
  } catch (error) {
    console.error('Add liquidity error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Remove liquidity from a pool
exports.removeLiquidity = async (req, res) => {
  try {
    const { pool_id, lp_amount } = req.body;
    const user_id = req.user.id;
    
    if (!pool_id || !lp_amount) {
      return res.status(400).json({ error: 'Pool ID and LP token amount are required' });
    }
    
    // Get liquidity pool
    const { data: pool, error: poolError } = await supabase
      .from('liquidity_pools')
      .select('*')
      .eq('id', pool_id)
      .single();
    
    if (poolError || !pool) {
      return res.status(404).json({ error: 'Liquidity pool not found' });
    }
    
    // Get user's LP tokens
    const { data: userLPTokens, error: lpError } = await supabase
      .from('lp_tokens')
      .select('*')
      .eq('user_id', user_id)
      .eq('pool_id', pool_id)
      .single();
    
    if (lpError || !userLPTokens) {
      return res.status(404).json({ error: 'You do not have LP tokens for this pool' });
    }
    
    if (userLPTokens.amount < lp_amount) {
      return res.status(400).json({ error: 'Insufficient LP tokens' });
    }
    
    // Calculate PI and token amounts to return
    const piToReturn = (lp_amount / pool.lp_token_supply) * pool.pi_reserve;
    const tokensToReturn = (lp_amount / pool.lp_token_supply) * pool.token_reserve;
    
    // Get user wallet
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user_id)
      .single();
    
    if (walletError || !wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    
    // Update user's PI balance
    await supabase
      .from('wallets')
      .update({ pi_balance: wallet.pi_balance + piToReturn })
      .eq('id', wallet.id);
    
    // Update user's token balance
    const { data: userToken } = await supabase
      .from('wallet_tokens')
      .select('*')
      .eq('wallet_id', wallet.id)
      .eq('token_id', pool.token_id)
      .single();
    
    if (userToken) {
      await supabase
        .from('wallet_tokens')
        .update({ 
          balance: userToken.balance + tokensToReturn,
          updated_at: new Date().toISOString()
        })
        .eq('id', userToken.id);
    } else {
      await supabase
        .from('wallet_tokens')
        .insert([{
          wallet_id: wallet.id,
          token_id: pool.token_id,
          balance: tokensToReturn,
          updated_at: new Date().toISOString()
        }]);
    }
    
    // Update user's LP tokens
    await supabase
      .from('lp_tokens')
      .update({ 
        amount: userLPTokens.amount - lp_amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', userLPTokens.id);
    
    // Update liquidity pool
    await supabase
      .from('liquidity_pools')
      .update({
        pi_reserve: pool.pi_reserve - piToReturn,
        token_reserve: pool.token_reserve - tokensToReturn,
        lp_token_supply: pool.lp_token_supply - lp_amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', pool.id);
    
    // Record the liquidity removal
    await supabase
      .from('liquidity_transactions')
      .insert([{
        user_id,
        pool_id: pool.id,
        type: 'remove',
        pi_amount: piToReturn,
        token_amount: tokensToReturn,
        lp_tokens: lp_amount,
        timestamp: new Date().toISOString()
      }]);
    
    res.json({
      message: 'Liquidity removed successfully',
      pi_amount: piToReturn,
      token_amount: tokensToReturn,
      lp_tokens: lp_amount
    });
  } catch (error) {
    console.error('Remove liquidity error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user's liquidity positions
exports.getUserLiquidityPositions = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const { data, error } = await supabase
      .from('lp_tokens')
      .select(`
        id,
        amount,
        created_at,
        updated_at,
        liquidity_pools(
          id,
          pi_reserve,
          token_reserve,
          lp_token_supply
        ),
        meme_coins(
          id,
          name,
          symbol,
          price
        )
      `)
      .eq('user_id', user_id);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    // Calculate value of each position
    const positions = data.map(position => {
      const pool = position.liquidity_pools;
      const token = position.meme_coins;
      const shareOfPool = position.amount / pool.lp_token_supply;
      const piValue = shareOfPool * pool.pi_reserve;
      const tokenValue = shareOfPool * pool.token_reserve;
      const totalValue = piValue + (tokenValue * token.price);
      
      return {
        id: position.id,
        pool_id: pool.id,
        token_id: token.id,
        token_name: token.name,
        token_symbol: token.symbol,
        lp_tokens: position.amount,
        share_of_pool: shareOfPool,
        pi_value: piValue,
        token_value: tokenValue,
        total_value: totalValue,
        created_at: position.created_at,
        updated_at: position.updated_at
      };
    });
    
    res.json(positions);
  } catch (error) {
    console.error('Get user liquidity positions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all liquidity pools
exports.getAllLiquidityPools = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('liquidity_pools')
      .select(`
        id,
        pi_reserve,
        token_reserve,
        lp_token_supply,
        created_at,
        updated_at,
        meme_coins(
          id,
          name,
          symbol,
          price
        )
      `);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    // Calculate additional pool metrics
    const pools = data.map(pool => {
      const token = pool.meme_coins;
      const totalLiquidity = pool.pi_reserve + (pool.token_reserve * token.price);
      const apr = calculatePoolAPR(pool.pi_reserve, pool.token_reserve, token.price);
      
      return {
        id: pool.id,
        token_id: token.id,
        token_name: token.name,
        token_symbol: token.symbol,
        pi_reserve: pool.pi_reserve,
        token_reserve: pool.token_reserve,
        lp_token_supply: pool.lp_token_supply,
        total_liquidity: totalLiquidity,
        apr,
        created_at: pool.created_at,
        updated_at: pool.updated_at
      };
    });
    
    res.json(pools);
  } catch (error) {
    console.error('Get all liquidity pools error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Helper function to calculate pool APR (Annual Percentage Rate)
function calculatePoolAPR(piReserve, tokenReserve, tokenPrice) {
  // This is a simplified calculation
  // In a real DEX, APR would be based on trading volume, fees, etc.
  const totalValue = piReserve + (tokenReserve * tokenPrice);
  
  // Assume daily trading volume is 5% of total liquidity
  const dailyVolume = totalValue * 0.05;
  
  // Assume fee is 0.3% of trading volume
  const dailyFees = dailyVolume * 0.003;
  
  // Annualize
  const yearlyFees = dailyFees * 365;
  
  // Calculate APR
  const apr = (yearlyFees / totalValue) * 100;
  
  return Math.min(apr, 200); // Cap at 200% APR for realism
} 