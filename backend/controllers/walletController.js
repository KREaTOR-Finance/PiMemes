const supabase = require('../config/supabase');
const crypto = require('crypto-js');

// Get user wallet
exports.getUserWallet = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    // Get wallet
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user_id)
      .single();
    
    if (walletError) {
      // Create wallet if it doesn't exist
      const { data: newWallet, error: createError } = await supabase
        .from('wallets')
        .insert([{
          user_id,
          pi_balance: 1000, // Give new users some test PI
          wallet_address: generateWalletAddress(user_id),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (createError) {
        return res.status(500).json({ error: createError.message });
      }
      
      return res.json({
        wallet: newWallet[0],
        tokens: []
      });
    }
    
    // Get tokens in wallet
    const { data: tokens, error: tokensError } = await supabase
      .from('wallet_tokens')
      .select(`
        id,
        balance,
        updated_at,
        meme_coins(
          id,
          name,
          symbol,
          price
        )
      `)
      .eq('wallet_id', wallet.id);
    
    if (tokensError) {
      return res.status(500).json({ error: tokensError.message });
    }
    
    // Format tokens
    const formattedTokens = tokens.map(token => ({
      id: token.id,
      token_id: token.meme_coins.id,
      name: token.meme_coins.name,
      symbol: token.meme_coins.symbol,
      balance: token.balance,
      price: token.meme_coins.price,
      value: token.balance * token.meme_coins.price,
      updated_at: token.updated_at
    }));
    
    res.json({
      wallet,
      tokens: formattedTokens
    });
  } catch (error) {
    console.error('Get user wallet error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Send PI to another user
exports.sendPI = async (req, res) => {
  try {
    const { recipient_address, amount } = req.body;
    const user_id = req.user.id;
    
    if (!recipient_address || !amount) {
      return res.status(400).json({ error: 'Recipient address and amount are required' });
    }
    
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }
    
    // Get sender's wallet
    const { data: senderWallet, error: senderError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user_id)
      .single();
    
    if (senderError || !senderWallet) {
      return res.status(404).json({ error: 'Sender wallet not found' });
    }
    
    // Check if sender has enough PI
    if (senderWallet.pi_balance < amount) {
      return res.status(400).json({ error: 'Insufficient PI balance' });
    }
    
    // Get recipient's wallet
    const { data: recipientWallet, error: recipientError } = await supabase
      .from('wallets')
      .select('*')
      .eq('wallet_address', recipient_address)
      .single();
    
    if (recipientError || !recipientWallet) {
      return res.status(404).json({ error: 'Recipient wallet not found' });
    }
    
    // Update sender's balance
    await supabase
      .from('wallets')
      .update({
        pi_balance: senderWallet.pi_balance - amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', senderWallet.id);
    
    // Update recipient's balance
    await supabase
      .from('wallets')
      .update({
        pi_balance: recipientWallet.pi_balance + amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', recipientWallet.id);
    
    // Record the transaction
    await supabase
      .from('pi_transactions')
      .insert([{
        sender_id: user_id,
        recipient_id: recipientWallet.user_id,
        amount,
        timestamp: new Date().toISOString()
      }]);
    
    res.json({
      message: 'PI sent successfully',
      amount,
      recipient: recipient_address,
      new_balance: senderWallet.pi_balance - amount
    });
  } catch (error) {
    console.error('Send PI error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Send tokens to another user
exports.sendTokens = async (req, res) => {
  try {
    const { recipient_address, token_id, amount } = req.body;
    const user_id = req.user.id;
    
    if (!recipient_address || !token_id || !amount) {
      return res.status(400).json({ error: 'Recipient address, token ID, and amount are required' });
    }
    
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }
    
    // Get sender's wallet
    const { data: senderWallet, error: senderError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user_id)
      .single();
    
    if (senderError || !senderWallet) {
      return res.status(404).json({ error: 'Sender wallet not found' });
    }
    
    // Check if sender has the token
    const { data: senderToken, error: tokenError } = await supabase
      .from('wallet_tokens')
      .select('*')
      .eq('wallet_id', senderWallet.id)
      .eq('token_id', token_id)
      .single();
    
    if (tokenError || !senderToken) {
      return res.status(404).json({ error: 'Token not found in sender wallet' });
    }
    
    // Check if sender has enough tokens
    if (senderToken.balance < amount) {
      return res.status(400).json({ error: 'Insufficient token balance' });
    }
    
    // Get recipient's wallet
    const { data: recipientWallet, error: recipientError } = await supabase
      .from('wallets')
      .select('*')
      .eq('wallet_address', recipient_address)
      .single();
    
    if (recipientError || !recipientWallet) {
      return res.status(404).json({ error: 'Recipient wallet not found' });
    }
    
    // Update sender's token balance
    await supabase
      .from('wallet_tokens')
      .update({
        balance: senderToken.balance - amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', senderToken.id);
    
    // Check if recipient has the token
    const { data: recipientToken } = await supabase
      .from('wallet_tokens')
      .select('*')
      .eq('wallet_id', recipientWallet.id)
      .eq('token_id', token_id)
      .single();
    
    if (recipientToken) {
      // Update recipient's token balance
      await supabase
        .from('wallet_tokens')
        .update({
          balance: recipientToken.balance + amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', recipientToken.id);
    } else {
      // Add token to recipient's wallet
      await supabase
        .from('wallet_tokens')
        .insert([{
          wallet_id: recipientWallet.id,
          token_id,
          balance: amount,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
    }
    
    // Get token details
    const { data: token } = await supabase
      .from('meme_coins')
      .select('name, symbol')
      .eq('id', token_id)
      .single();
    
    // Record the transaction
    await supabase
      .from('token_transactions')
      .insert([{
        sender_id: user_id,
        recipient_id: recipientWallet.user_id,
        token_id,
        amount,
        timestamp: new Date().toISOString()
      }]);
    
    res.json({
      message: 'Tokens sent successfully',
      amount,
      token: token ? token.symbol : 'Unknown',
      recipient: recipient_address,
      new_balance: senderToken.balance - amount
    });
  } catch (error) {
    console.error('Send tokens error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get transaction history
exports.getTransactionHistory = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    // Get PI transactions
    const { data: piSent } = await supabase
      .from('pi_transactions')
      .select(`
        id,
        amount,
        timestamp,
        wallets!recipient_id(wallet_address)
      `)
      .eq('sender_id', user_id)
      .order('timestamp', { ascending: false });
    
    const { data: piReceived } = await supabase
      .from('pi_transactions')
      .select(`
        id,
        amount,
        timestamp,
        wallets!sender_id(wallet_address)
      `)
      .eq('recipient_id', user_id)
      .order('timestamp', { ascending: false });
    
    // Get token transactions
    const { data: tokensSent } = await supabase
      .from('token_transactions')
      .select(`
        id,
        amount,
        timestamp,
        wallets!recipient_id(wallet_address),
        meme_coins(name, symbol)
      `)
      .eq('sender_id', user_id)
      .order('timestamp', { ascending: false });
    
    const { data: tokensReceived } = await supabase
      .from('token_transactions')
      .select(`
        id,
        amount,
        timestamp,
        wallets!sender_id(wallet_address),
        meme_coins(name, symbol)
      `)
      .eq('recipient_id', user_id)
      .order('timestamp', { ascending: false });
    
    // Format transactions
    const transactions = [
      ...piSent.map(tx => ({
        id: tx.id,
        type: 'pi_sent',
        amount: tx.amount,
        recipient: tx.wallets.wallet_address,
        timestamp: tx.timestamp
      })),
      ...piReceived.map(tx => ({
        id: tx.id,
        type: 'pi_received',
        amount: tx.amount,
        sender: tx.wallets.wallet_address,
        timestamp: tx.timestamp
      })),
      ...tokensSent.map(tx => ({
        id: tx.id,
        type: 'token_sent',
        token: tx.meme_coins.symbol,
        amount: tx.amount,
        recipient: tx.wallets.wallet_address,
        timestamp: tx.timestamp
      })),
      ...tokensReceived.map(tx => ({
        id: tx.id,
        type: 'token_received',
        token: tx.meme_coins.symbol,
        amount: tx.amount,
        sender: tx.wallets.wallet_address,
        timestamp: tx.timestamp
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json(transactions);
  } catch (error) {
    console.error('Get transaction history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Helper function to generate a wallet address
function generateWalletAddress(userId) {
  const hash = crypto.SHA256(userId + Date.now().toString()).toString();
  return '0x' + hash.substring(0, 40);
} 