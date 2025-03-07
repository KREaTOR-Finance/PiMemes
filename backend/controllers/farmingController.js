const supabase = require('../config/supabase');
const { calculateRewards } = require('../services/farmingService');

// Get all farming pools
exports.getAllFarmingPools = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('farming_pools')
      .select(`
        id,
        name,
        token_id,
        reward_token_id,
        total_staked,
        reward_rate,
        apr,
        start_time,
        end_time,
        created_at,
        updated_at,
        meme_coins!token_id(
          id,
          name,
          symbol,
          price
        ),
        meme_coins!reward_token_id(
          id,
          name,
          symbol,
          price
        )
      `);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    // Format the response
    const pools = data.map(pool => ({
      id: pool.id,
      name: pool.name,
      token: {
        id: pool.meme_coins.id,
        name: pool.meme_coins.name,
        symbol: pool.meme_coins.symbol,
        price: pool.meme_coins.price
      },
      reward_token: pool.reward_token_id ? {
        id: pool['meme_coins!reward_token_id'].id,
        name: pool['meme_coins!reward_token_id'].name,
        symbol: pool['meme_coins!reward_token_id'].symbol,
        price: pool['meme_coins!reward_token_id'].price
      } : null,
      total_staked: pool.total_staked,
      reward_rate: pool.reward_rate,
      apr: pool.apr,
      start_time: pool.start_time,
      end_time: pool.end_time,
      created_at: pool.created_at,
      updated_at: pool.updated_at
    }));
    
    res.json(pools);
  } catch (error) {
    console.error('Get all farming pools error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Stake LP tokens
exports.stakeLPTokens = async (req, res) => {
  try {
    const { pool_id, lp_token_id, amount } = req.body;
    const user_id = req.user.id;
    
    if (!pool_id || !lp_token_id || !amount) {
      return res.status(400).json({ error: 'Pool ID, LP token ID, and amount are required' });
    }
    
    // Get farming pool
    const { data: pool, error: poolError } = await supabase
      .from('farming_pools')
      .select('*')
      .eq('id', pool_id)
      .single();
    
    if (poolError || !pool) {
      return res.status(404).json({ error: 'Farming pool not found' });
    }
    
    // Get user's LP tokens
    const { data: lpToken, error: lpError } = await supabase
      .from('lp_tokens')
      .select('*')
      .eq('id', lp_token_id)
      .eq('user_id', user_id)
      .single();
    
    if (lpError || !lpToken) {
      return res.status(404).json({ error: 'LP token not found or does not belong to user' });
    }
    
    if (lpToken.amount < amount) {
      return res.status(400).json({ error: 'Insufficient LP tokens' });
    }
    
    // Check if user already has a stake in this pool
    const { data: existingStake, error: stakeError } = await supabase
      .from('farming_stakes')
      .select('*')
      .eq('user_id', user_id)
      .eq('pool_id', pool_id)
      .single();
    
    let stakeId;
    
    if (existingStake) {
      // If user already has a stake, update it
      
      // First, calculate and distribute any pending rewards
      const pendingRewards = calculateRewards(
        existingStake.amount,
        existingStake.last_harvest_time,
        pool.reward_rate
      );
      
      if (pendingRewards > 0) {
        // Add rewards to user's wallet
        await distributeRewards(user_id, pool.reward_token_id, pendingRewards);
      }
      
      // Update the stake
      await supabase
        .from('farming_stakes')
        .update({
          amount: existingStake.amount + amount,
          last_harvest_time: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingStake.id);
      
      stakeId = existingStake.id;
    } else {
      // Create a new stake
      const { data: newStake, error: createError } = await supabase
        .from('farming_stakes')
        .insert([{
          user_id,
          pool_id,
          lp_token_id,
          amount,
          last_harvest_time: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (createError) {
        return res.status(500).json({ error: createError.message });
      }
      
      stakeId = newStake[0].id;
    }
    
    // Update user's LP token balance
    await supabase
      .from('lp_tokens')
      .update({
        amount: lpToken.amount - amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', lp_token_id);
    
    // Update farming pool's total staked
    await supabase
      .from('farming_pools')
      .update({
        total_staked: pool.total_staked + amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', pool_id);
    
    // Record the staking transaction
    await supabase
      .from('farming_transactions')
      .insert([{
        user_id,
        pool_id,
        stake_id: stakeId,
        type: 'stake',
        amount,
        timestamp: new Date().toISOString()
      }]);
    
    res.json({
      message: 'LP tokens staked successfully',
      stake_id: stakeId,
      amount
    });
  } catch (error) {
    console.error('Stake LP tokens error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Unstake LP tokens
exports.unstakeLPTokens = async (req, res) => {
  try {
    const { stake_id, amount } = req.body;
    const user_id = req.user.id;
    
    if (!stake_id || !amount) {
      return res.status(400).json({ error: 'Stake ID and amount are required' });
    }
    
    // Get user's stake
    const { data: stake, error: stakeError } = await supabase
      .from('farming_stakes')
      .select('*, farming_pools(*)')
      .eq('id', stake_id)
      .eq('user_id', user_id)
      .single();
    
    if (stakeError || !stake) {
      return res.status(404).json({ error: 'Stake not found or does not belong to user' });
    }
    
    if (stake.amount < amount) {
      return res.status(400).json({ error: 'Insufficient staked amount' });
    }
    
    // Calculate and distribute any pending rewards
    const pendingRewards = calculateRewards(
      stake.amount,
      stake.last_harvest_time,
      stake.farming_pools.reward_rate
    );
    
    if (pendingRewards > 0) {
      // Add rewards to user's wallet
      await distributeRewards(user_id, stake.farming_pools.reward_token_id, pendingRewards);
    }
    
    // Update the stake
    if (stake.amount === amount) {
      // If unstaking all, delete the stake
      await supabase
        .from('farming_stakes')
        .delete()
        .eq('id', stake_id);
    } else {
      // Otherwise, update the stake
      await supabase
        .from('farming_stakes')
        .update({
          amount: stake.amount - amount,
          last_harvest_time: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', stake_id);
    }
    
    // Update user's LP token balance
    const { data: lpToken } = await supabase
      .from('lp_tokens')
      .select('*')
      .eq('id', stake.lp_token_id)
      .single();
    
    if (lpToken) {
      await supabase
        .from('lp_tokens')
        .update({
          amount: lpToken.amount + amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', stake.lp_token_id);
    } else {
      // If LP token entry was deleted, create a new one
      await supabase
        .from('lp_tokens')
        .insert([{
          user_id,
          pool_id: stake.pool_id,
          token_id: stake.farming_pools.token_id,
          amount,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
    }
    
    // Update farming pool's total staked
    await supabase
      .from('farming_pools')
      .update({
        total_staked: stake.farming_pools.total_staked - amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', stake.pool_id);
    
    // Record the unstaking transaction
    await supabase
      .from('farming_transactions')
      .insert([{
        user_id,
        pool_id: stake.pool_id,
        stake_id,
        type: 'unstake',
        amount,
        timestamp: new Date().toISOString()
      }]);
    
    res.json({
      message: 'LP tokens unstaked successfully',
      amount,
      rewards: pendingRewards
    });
  } catch (error) {
    console.error('Unstake LP tokens error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Harvest rewards
exports.harvestRewards = async (req, res) => {
  try {
    const { stake_id } = req.body;
    const user_id = req.user.id;
    
    if (!stake_id) {
      return res.status(400).json({ error: 'Stake ID is required' });
    }
    
    // Get user's stake
    const { data: stake, error: stakeError } = await supabase
      .from('farming_stakes')
      .select('*, farming_pools(*)')
      .eq('id', stake_id)
      .eq('user_id', user_id)
      .single();
    
    if (stakeError || !stake) {
      return res.status(404).json({ error: 'Stake not found or does not belong to user' });
    }
    
    // Calculate pending rewards
    const pendingRewards = calculateRewards(
      stake.amount,
      stake.last_harvest_time,
      stake.farming_pools.reward_rate
    );
    
    if (pendingRewards <= 0) {
      return res.status(400).json({ error: 'No rewards to harvest' });
    }
    
    // Add rewards to user's wallet
    await distributeRewards(user_id, stake.farming_pools.reward_token_id, pendingRewards);
    
    // Update the stake's last harvest time
    await supabase
      .from('farming_stakes')
      .update({
        last_harvest_time: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', stake_id);
    
    // Record the harvest transaction
    await supabase
      .from('farming_transactions')
      .insert([{
        user_id,
        pool_id: stake.pool_id,
        stake_id,
        type: 'harvest',
        amount: pendingRewards,
        timestamp: new Date().toISOString()
      }]);
    
    res.json({
      message: 'Rewards harvested successfully',
      rewards: pendingRewards
    });
  } catch (error) {
    console.error('Harvest rewards error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user's farming positions
exports.getUserFarmingPositions = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const { data, error } = await supabase
      .from('farming_stakes')
      .select(`
        id,
        amount,
        last_harvest_time,
        created_at,
        updated_at,
        farming_pools(
          id,
          name,
          token_id,
          reward_token_id,
          reward_rate,
          apr,
          meme_coins!token_id(
            id,
            name,
            symbol,
            price
          ),
          meme_coins!reward_token_id(
            id,
            name,
            symbol,
            price
          )
        )
      `)
      .eq('user_id', user_id);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    // Calculate pending rewards for each position
    const positions = data.map(position => {
      const pool = position.farming_pools;
      const pendingRewards = calculateRewards(
        position.amount,
        position.last_harvest_time,
        pool.reward_rate
      );
      
      return {
        id: position.id,
        pool_id: pool.id,
        pool_name: pool.name,
        token: {
          id: pool.meme_coins.id,
          name: pool.meme_coins.name,
          symbol: pool.meme_coins.symbol,
          price: pool.meme_coins.price
        },
        reward_token: pool.reward_token_id ? {
          id: pool['meme_coins!reward_token_id'].id,
          name: pool['meme_coins!reward_token_id'].name,
          symbol: pool['meme_coins!reward_token_id'].symbol,
          price: pool['meme_coins!reward_token_id'].price
        } : null,
        staked_amount: position.amount,
        pending_rewards: pendingRewards,
        apr: pool.apr,
        last_harvest_time: position.last_harvest_time,
        created_at: position.created_at,
        updated_at: position.updated_at
      };
    });
    
    res.json(positions);
  } catch (error) {
    console.error('Get user farming positions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Helper function to distribute rewards to user
async function distributeRewards(userId, tokenId, amount) {
  // Get user's wallet
  const { data: wallet } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (!wallet) {
    throw new Error('User wallet not found');
  }
  
  // Check if user already has this token
  const { data: userToken } = await supabase
    .from('wallet_tokens')
    .select('*')
    .eq('wallet_id', wallet.id)
    .eq('token_id', tokenId)
    .single();
  
  if (userToken) {
    // Update existing token balance
    await supabase
      .from('wallet_tokens')
      .update({
        balance: userToken.balance + amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', userToken.id);
  } else {
    // Add new token to wallet
    await supabase
      .from('wallet_tokens')
      .insert([{
        wallet_id: wallet.id,
        token_id: tokenId,
        balance: amount,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);
  }
} 