# PiMemes - Pi Network Meme Coin Platform

PiMemes is a decentralized platform for creating and trading meme coins on the Pi Network. Create your own meme coins, provide liquidity, and trade tokens in a fun and secure environment.

## Features

- 🪙 Create custom meme coins with configurable tokenomics
- 💱 Swap tokens through automated market makers (AMM)
- 💧 Provide liquidity and earn fees
- 👤 User profiles and wallet management
- 📊 Real-time price charts and trading data
- 🔒 Secure authentication and authorization

## Tech Stack

- **Frontend:**
  - React.js
  - React Router
  - Zustand (State Management)
  - TailwindCSS

- **Backend:**
  - Node.js
  - Express
  - Supabase (Database & Authentication)
  - WebSocket (Real-time Updates)

## Quick Start

### Prerequisites

- Node.js >= 16
- npm or yarn
- Supabase account
- Pi Network API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/KREaTOR-Finance/PiMemes.git
cd PiMemes
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:
```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
```

4. Update the environment variables with your credentials:
- Supabase URL and keys
- Pi Network API credentials
- JWT secret

5. Initialize the database:
- Create a new Supabase project
- Run the SQL schema from `backend/database/schema.sql`

6. Start the development servers:
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm start
```

## Deployment

### Frontend (GitHub Pages)

1. Update `package.json`:
```json
{
  "homepage": "https://kreator-finance.github.io/PiMemes"
}
```

2. Build and deploy:
```bash
npm run build
npm run deploy
```

### Backend (Railway)

1. Connect your GitHub repository to Railway
2. Set up environment variables in Railway dashboard
3. Deploy using Railway's automatic deployment

## Security

- Row Level Security (RLS) enabled for all database tables
- JWT authentication
- Rate limiting for API endpoints
- Secure WebSocket connections
- Environment variable protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

KREaTOR Finance - [@KREaTORFinance](https://twitter.com/KREaTORFinance)

Project Link: [https://github.com/KREaTOR-Finance/PiMemes](https://github.com/KREaTOR-Finance/PiMemes)