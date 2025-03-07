const WebSocket = require('ws');
const supabase = require('../config/supabase');

// Create WebSocket server
const createWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });
  
  // Store active subscriptions
  const subscriptions = new Map();
  
  wss.on('connection', (ws) => {
    console.log('Client connected');
    
    // Handle messages from clients
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        
        if (data.type === 'subscribe') {
          // Subscribe to token updates
          if (data.token_id) {
            // Store subscription
            subscriptions.set(ws, {
              type: 'token',
              token_id: data.token_id
            });
            
            // Send initial data
            const { data: trades } = await supabase
              .from('transactions')
              .select(`
                id,
                type,
                amount,
                price,
                total_value,
                timestamp,
                users(username),
                meme_coins(name, symbol)
              `)
              .eq('token_id', data.token_id)
              .order('timestamp', { ascending: false })
              .limit(20);
            
            ws.send(JSON.stringify({
              type: 'trades',
              data: trades
            }));
          } else if (data.pool_id) {
            // Subscribe to liquidity pool updates
            subscriptions.set(ws, {
              type: 'pool',
              pool_id: data.pool_id
            });
            
            // Send initial data
            const { data: pool } = await supabase
              .from('liquidity_pools')
              .select(`
                id,
                pi_reserve,
                token_reserve,
                lp_token_supply,
                updated_at,
                meme_coins(
                  id,
                  name,
                  symbol,
                  price
                )
              `)
              .eq('id', data.pool_id)
              .single();
            
            ws.send(JSON.stringify({
              type: 'pool',
              data: pool
            }));
          } else {
            // Subscribe to all trades
            subscriptions.set(ws, {
              type: 'all_trades'
            });
            
            // Send initial data
            const { data: trades } = await supabase
              .from('transactions')
              .select(`
                id,
                type,
                amount,
                price,
                total_value,
                timestamp,
                users(username),
                meme_coins(name, symbol)
              `)
              .order('timestamp', { ascending: false })
              .limit(20);
            
            ws.send(JSON.stringify({
              type: 'trades',
              data: trades
            }));
          }
        } else if (data.type === 'unsubscribe') {
          // Remove subscription
          subscriptions.delete(ws);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      console.log('Client disconnected');
      subscriptions.delete(ws);
    });
  });
  
  // Set up Supabase realtime subscription for trades
  const setupRealtimeSubscriptions = async () => {
    // Subscribe to transactions table
    const transactionSubscription = supabase
      .channel('transactions-channel')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'transactions' 
      }, async (payload) => {
        // Get full transaction data
        const { data: transaction } = await supabase
          .from('transactions')
          .select(`
            id,
            type,
            amount,
            price,
            total_value,
            timestamp,
            token_id,
            users(username),
            meme_coins(name, symbol)
          `)
          .eq('id', payload.new.id)
          .single();
        
        // Broadcast to relevant clients
        for (const [ws, sub] of subscriptions.entries()) {
          if (
            (sub.type === 'all_trades') ||
            (sub.type === 'token' && sub.token_id === transaction.token_id)
          ) {
            ws.send(JSON.stringify({
              type: 'trade',
              data: transaction
            }));
          }
        }
      })
      .subscribe();
    
    // Subscribe to liquidity pools table
    const poolSubscription = supabase
      .channel('pools-channel')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'liquidity_pools' 
      }, async (payload) => {
        // Get full pool data
        const { data: pool } = await supabase
          .from('liquidity_pools')
          .select(`
            id,
            pi_reserve,
            token_reserve,
            lp_token_supply,
            updated_at,
            meme_coins(
              id,
              name,
              symbol,
              price
            )
          `)
          .eq('id', payload.new.id)
          .single();
        
        // Broadcast to relevant clients
        for (const [ws, sub] of subscriptions.entries()) {
          if (sub.type === 'pool' && sub.pool_id === pool.id) {
            ws.send(JSON.stringify({
              type: 'pool',
              data: pool
            }));
          }
        }
      })
      .subscribe();
  };
  
  // Start realtime subscriptions
  setupRealtimeSubscriptions();
  
  return wss;
};

module.exports = createWebSocketServer; 