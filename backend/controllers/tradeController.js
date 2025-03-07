const supabase = require('../config/supabase');
const { calculatePrice, calculateSlippage, calculateFees } = require('../services/tradingService');

// Execute a trade (buy or sell)
exports.executeTrade = async (req, res) => {
  try {
    const { token_id, amount, type } = req.body;
    const user_id = req.user.id;
    
    if (!token_id || !amount || !type) {
      return res.status(400).json({ error: 'Token ID, amount, and trade type are required' });
    }
    
    if (type !== 'buy' && type !== 'sell') {
      return res.status(400).json({ error: 'Trade type must be buy or sell' });
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
    
    // Get liquidity pool
    const { data: pool, error: poolError } = await supabase
      .from('liquidity_pools')
      .select('*')
      .eq('token_id', token_id)
      .single();
    
    if (poolError || !pool) {
      return res.status(400).json({ error: 'No liquidity pool available for this token' });
    }
    
    // Calculate price based on AMM formula (x * y = k)
    const price = calculatePrice(pool.pi_reserve, pool.token_reserve, amount, type);
    
    // Calculate slippage
    const slippage = calculateSlippage(pool.pi_reserve, pool.token_reserve, amount, type);
    
    // Calculate fees
    const { marketingFee, liquidityFee, devFee, totalFee } = calculateFees(
      amount, 
      price, 
      token.marketing_tax, 
      token.liquidity_tax, 
      token.dev_tax
    );
    
    const totalValue = amount * price;
    
    // Execute the trade
    if (type === 'buy') {
      // Check if user has enough PI
      if (wallet.pi_balance < totalValue) {
        return res.status(400).json({ error: 'Insufficient PI balance' });
      }
      
      // Update user's PI balance
      await supabase
        .from('wallets')
        .update({ pi_balance: wallet.pi_balance - totalValue })
        .eq('id', wallet.id);
      
      // Update user's token balance
      const { data: userToken } = await supabase
        .from('wallet_tokens')
        .select('*')
        .eq('wallet_id', wallet.id)
        .eq('token_id', token_id)
        .single();
      
      if (userToken) {
        await supabase
          .from('wallet_tokens')
          .update({ 
            balance: userToken.balance + (amount - totalFee),
            updated_at: new Date().toISOString()
          })
          .eq('id', userToken.id);
      } else {
        await supabase
          .from('wallet_tokens')
          .insert([{
            wallet_id: wallet.id,
            token_id: token_id,
            balance: amount - totalFee,
            updated_at: new Date().toISOString()
          }]);
      }
      
      // Update liquidity pool
      await supabase
        .from('liquidity_pools')
        .update({
          pi_reserve: pool.pi_reserve + (totalValue - marketingFee - devFee),
          token_reserve: pool.token_reserve - amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', pool.id);
      
    } else { // Sell
      // Check if user has enough tokens
      const { data: userToken } = await supabase
        .from('wallet_tokens')
        .select('*')
        .eq('wallet_id', wallet.id)
        .eq('token_id', token_id)
        .single();
      
      if (!userToken || userToken.balance < amount) {
        return res.status(400).json({ error: 'Insufficient token balance' });
      }
      
      // Update user's token balance
      await supabase
        .from('wallet_tokens')
        .update({ 
          balance: userToken.balance - amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', userToken.id);
      
      // Update user's PI balance
      await supabase
        .from('wallets')
        .update({ pi_balance: wallet.pi_balance + (totalValue - totalFee) })
        .eq('id', wallet.id);
      
      // Update liquidity pool
      await supabase
        .from('liquidity_pools')
        .update({
          pi_reserve: pool.pi_reserve - (totalValue - totalFee),
          token_reserve: pool.token_reserve + amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', pool.id);
    }
    
    // Record the transaction
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert([{
        user_id,
        token_id,
        type,
        amount,
        price,
        total_value: totalValue,
        fee: totalFee,
        slippage,
        timestamp: new Date().toISOString()
      }])
      .select();
    
    if (txError) {
      console.error('Error recording transaction:', txError);
    }
    
    // Update token price
    await supabase
      .from('meme_coins')
      .update({ 
        price,
        market_cap: token.supply * price,
        updated_at: new Date().toISOString()
      })
      .eq('id', token_id);
    
    // Record price history
    await supabase
      .from('token_prices')
      .insert([{
        token_id,
        price,
        timestamp: new Date().toISOString()
      }]);
    
    res.json({
      message: `${type === 'buy' ? 'Buy' : 'Sell'} order executed successfully`,
      transaction: transaction ? transaction[0] : null,
      price,
      amount,
      total_value: totalValue,
      fee: totalFee,
      slippage
    });
  } catch (error) {
    console.error('Trade execution error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get recent trades
exports.getRecentTrades = async (req, res) => {
  try {
    const { token_id } = req.params;
    
    const query = supabase
      .from('transactions')
      .select(`
        id,
        type,
        amount,
        price,
        total_value,
        fee,
        slippage,
        timestamp,
        users(username),
        meme_coins(name, symbol)
      `)
      .order('timestamp', { ascending: false })
      .limit(50);
    
    if (token_id) {
      query.eq('token_id', token_id);
    }
    
    const { data, error } = await query;
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Get recent trades error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user trades
exports.getUserTrades = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        type,
        amount,
        price,
        total_value,
        fee,
        slippage,
        timestamp,
        meme_coins(name, symbol)
      `)
      .eq('user_id', user_id)
      .order('timestamp', { ascending: false });
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Get user trades error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}; 