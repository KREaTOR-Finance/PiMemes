/*
Supabase Connection Details:
URL: https://rzvlfjjcdvuqmqlbmkwj.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6dmxmampjZHZ1cW1xbGJta3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNzQxNTUsImV4cCI6MjA1Njk1MDE1NX0.BNcZYXjaUmhUAiBbeQPaS6QIJyomBs1bDWbqTHYMOxg
*/

-- Enable UUID extension (already available in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create auth schema if it doesn't exist (for RLS policies)
CREATE SCHEMA IF NOT EXISTS auth;

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    username TEXT UNIQUE NOT NULL,
    pi_wallet_address TEXT UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meme Coins table
CREATE TABLE IF NOT EXISTS public.meme_coins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES auth.users(id),
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
CREATE TABLE IF NOT EXISTS public.liquidity_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_id UUID REFERENCES public.meme_coins(id),
    pi_reserve NUMERIC NOT NULL DEFAULT 0,
    token_reserve NUMERIC NOT NULL DEFAULT 0,
    lp_token_supply NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LP Tokens table (tracks user's liquidity provision)
CREATE TABLE IF NOT EXISTS public.lp_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    pool_id UUID REFERENCES public.liquidity_pools(id),
    token_id UUID REFERENCES public.meme_coins(id),
    amount NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    token_id UUID REFERENCES public.meme_coins(id),
    type TEXT NOT NULL, -- 'buy', 'sell', 'transfer'
    amount NUMERIC NOT NULL,
    price NUMERIC NOT NULL,
    total_value NUMERIC NOT NULL,
    fee NUMERIC NOT NULL DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Liquidity Transactions table
CREATE TABLE IF NOT EXISTS public.liquidity_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    pool_id UUID REFERENCES public.liquidity_pools(id),
    type TEXT NOT NULL, -- 'add', 'remove'
    pi_amount NUMERIC NOT NULL,
    token_amount NUMERIC NOT NULL,
    lp_tokens NUMERIC NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Balances table
CREATE TABLE IF NOT EXISTS public.user_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    token_id UUID REFERENCES public.meme_coins(id),
    amount NUMERIC NOT NULL DEFAULT 0,
    UNIQUE(user_id, token_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_meme_coins_symbol ON public.meme_coins(symbol);
CREATE INDEX IF NOT EXISTS idx_meme_coins_verified ON public.meme_coins(verified);
CREATE INDEX IF NOT EXISTS idx_meme_coins_creator ON public.meme_coins(creator_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_token ON public.transactions(token_id);
CREATE INDEX IF NOT EXISTS idx_lp_tokens_user ON public.lp_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_user_balances_user ON public.user_balances(user_id);
CREATE INDEX IF NOT EXISTS idx_user_balances_token ON public.user_balances(token_id);

-- Create updated_at triggers for all tables
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meme_coins_updated_at
    BEFORE UPDATE ON public.meme_coins
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_liquidity_pools_updated_at
    BEFORE UPDATE ON public.liquidity_pools
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lp_tokens_updated_at
    BEFORE UPDATE ON public.lp_tokens
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meme_coins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liquidity_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lp_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liquidity_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Meme Coins policies
CREATE POLICY "Anyone can read verified tokens"
    ON public.meme_coins FOR SELECT
    USING (verified = true);

CREATE POLICY "Token creators can read their own tokens"
    ON public.meme_coins FOR SELECT
    USING (auth.uid() = creator_id);

CREATE POLICY "Token creators can update their own tokens"
    ON public.meme_coins FOR UPDATE
    USING (auth.uid() = creator_id);

CREATE POLICY "Authenticated users can create tokens"
    ON public.meme_coins FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Liquidity pools policies
CREATE POLICY "Anyone can read liquidity pools"
    ON public.liquidity_pools FOR SELECT
    USING (true);

-- LP tokens policies
CREATE POLICY "Users can read their own LP tokens"
    ON public.lp_tokens FOR SELECT
    USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can read their own transactions"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- User balances policies
CREATE POLICY "Users can read their own balances"
    ON public.user_balances FOR SELECT
    USING (auth.uid() = user_id);

-- Create admin users view
CREATE VIEW admin_users AS
    SELECT id as user_id
    FROM public.profiles
    WHERE is_admin = true;