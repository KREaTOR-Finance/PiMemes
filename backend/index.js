const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Import WebSocket server
const createWebSocketServer = require('./websockets');

// Create WebSocket server
const wss = createWebSocketServer(server);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/token', require('./routes/tokenRoutes'));
app.use('/api/trade', require('./routes/tradeRoutes'));
app.use('/api/liquidity', require('./routes/liquidityRoutes'));
app.use('/api/farming', require('./routes/farmingRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'PiMemes API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
}); 