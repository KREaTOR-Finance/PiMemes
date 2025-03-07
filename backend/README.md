# PiMemes Backend

This is the backend API for the PiMemes application, which handles token creation and management.

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file with the following variables:
```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

3. Start the server:
```
npm start
```

## API Endpoints

### Token Creation

- **POST /api/token/create** - Create a new meme coin
  - Request body:
    ```json
    {
      "name": "DOGEPI",
      "supply": "1000000000",
      "minting": false,
      "marketingTax": 2,
      "liquidityTax": 2,
      "devTax": 1,
      "creatorWallet": "0x123...",
      "creatorAllocation": 10,
      "initialLiquidity": 1000
    }
    ```

### Token Retrieval

- **GET /api/token/list** - Get all tokens
- **GET /api/token/:id** - Get a specific token by ID

## Database Schema

The Supabase database has a `meme_coins` table with the following structure:

- `id` - UUID (primary key)
- `name` - String (token name)
- `supply` - Numeric (total supply)
- `minting` - Boolean (whether minting is enabled)
- `marketing_tax` - Numeric (marketing tax percentage)
- `liquidity_tax` - Numeric (liquidity tax percentage)
- `dev_tax` - Numeric (developer tax percentage)
- `creator_wallet` - String (creator's wallet address)
- `creator_allocation` - Numeric (percentage allocated to creator)
- `initial_liquidity` - Numeric (initial liquidity in PI)
- `created_at` - Timestamp 