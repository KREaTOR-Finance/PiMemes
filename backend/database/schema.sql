/*
Supabase Connection Details:
URL: https://rzvlfjjcdvuqmqlbmkwj.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6dmxmampjZHZ1cW1xbGJta3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNzQxNTUsImV4cCI6MjA1Njk1MDE1NX0.BNcZYXjaUmhUAiBbeQPaS6QIJyomBs1bDWbqTHYMOxg
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_crypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    pi_wallet_address TEXT UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meme Coins table
CREATE TABLE IF NOT EXISTS meme_coins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES users(id),
    name TEXT NOT NULL,
    symbol TEXT NOT NULL,
    decimals INTEGER DEFAULT 18,
    total_supply NUMERIC NOT NULL,
    description TEXT,
    
    -- Images
    logo_image TEXT,
    banner_image TEXT,
    
    -- Chain Info
    network TEXT NOT NULL,
    contract_address TEXT UNIQUE,
    
    -- Socials
    website TEXT,
    twitter TEXT,
    telegram TEXT,
    discord TEXT,
    github TEXT,
    medium TEXT,
    
    -- Contact
    contact_email TEXT,
    team_name TEXT,
    location TEXT,
    
    -- Additional Info
    whitepaper TEXT,
    roadmap TEXT,
    tags TEXT[],
    launch_date TIMESTAMP WITH TIME ZONE,
    verified BOOLEAN DEFAULT false,
    
    -- Market Data
    initial_price NUMERIC,
    current_price NUMERIC,
    market_cap NUMERIC,
    total_liquidity NUMERIC DEFAULT 0,
    liquidity_locked BOOLEAN DEFAULT false,
    liquidity_lock_period INTERVAL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Liquidity Pools table
CREATE TABLE IF NOT EXISTS liquidity_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_id UUID REFERENCES meme_coins(id),
    pi_reserve NUMERIC NOT NULL DEFAULT 0,
    token_reserve NUMERIC NOT NULL DEFAULT 0,
    lp_token_supply NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LP Tokens table (tracks user's liquidity provision)
CREATE TABLE IF NOT EXISTS lp_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    pool_id UUID REFERENCES liquidity_pools(id),
    token_id UUID REFERENCES meme_coins(id),
    amount NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    token_id UUID REFERENCES meme_coins(id),
    type TEXT NOT NULL, -- 'buy', 'sell', 'transfer'
    amount NUMERIC NOT NULL,
    price NUMERIC NOT NULL,
    total_value NUMERIC NOT NULL,
    fee NUMERIC NOT NULL DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Liquidity Transactions table
CREATE TABLE IF NOT EXISTS liquidity_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    pool_id UUID REFERENCES liquidity_pools(id),
    type TEXT NOT NULL, -- 'add', 'remove'
    pi_amount NUMERIC NOT NULL,
    token_amount NUMERIC NOT NULL,
    lp_tokens NUMERIC NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Balances table
CREATE TABLE IF NOT EXISTS user_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    token_id UUID REFERENCES meme_coins(id),
    amount NUMERIC NOT NULL DEFAULT 0,
    UNIQUE(user_id, token_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_meme_coins_symbol ON meme_coins(symbol);
CREATE INDEX IF NOT EXISTS idx_meme_coins_verified ON meme_coins(verified);
CREATE INDEX IF NOT EXISTS idx_meme_coins_creator ON meme_coins(creator_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_token ON transactions(token_id);
CREATE INDEX IF NOT EXISTS idx_lp_tokens_user ON lp_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_user_balances_user ON user_balances(user_id);
CREATE INDEX IF NOT EXISTS idx_user_balances_token ON user_balances(token_id);

-- Create updated_at triggers for all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meme_coins_updated_at
    BEFORE UPDATE ON meme_coins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_liquidity_pools_updated_at
    BEFORE UPDATE ON liquidity_pools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lp_tokens_updated_at
    BEFORE UPDATE ON lp_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meme_coins ENABLE ROW LEVEL SECURITY;
ALTER TABLE liquidity_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE lp_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE liquidity_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Meme Coins policies
CREATE POLICY "Anyone can read verified tokens" ON meme_coins
    FOR SELECT USING (verified = true);

CREATE POLICY "Token creators can read their own tokens" ON meme_coins
    FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Token creators can update their own tokens" ON meme_coins
    FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Authenticated users can create tokens" ON meme_coins
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Liquidity pools policies
CREATE POLICY "Anyone can read liquidity pools" ON liquidity_pools
    FOR SELECT USING (true);

-- LP tokens policies
CREATE POLICY "Users can read their own LP tokens" ON lp_tokens
    FOR SELECT USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can read their own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User balances policies
CREATE POLICY "Users can read their own balances" ON user_balances
    FOR SELECT USING (auth.uid() = user_id);

-- Create admin users view
CREATE VIEW admin_users AS
    SELECT id as user_id
    FROM users
    WHERE is_admin = true;