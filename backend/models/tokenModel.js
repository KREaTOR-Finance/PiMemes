const supabase = require("../config/supabase");

const createToken = async (tokenData) => {
  // Transform the data to match Supabase column naming convention
  const tokenRecord = {
    name: tokenData.name,
    symbol: tokenData.symbol,
    decimals: tokenData.decimals,
    total_supply: tokenData.totalSupply,
    description: tokenData.description,
    
    // Images
    logo_image: tokenData.logoImage,
    banner_image: tokenData.bannerImage,
    
    // Chain Info
    network: tokenData.network,
    contract_address: tokenData.contractAddress,
    
    // Socials
    website: tokenData.socials.website,
    twitter: tokenData.socials.twitter,
    telegram: tokenData.socials.telegram,
    discord: tokenData.socials.discord,
    github: tokenData.socials.github,
    medium: tokenData.socials.medium,
    
    // Contact
    contact_email: tokenData.contact.email,
    team_name: tokenData.contact.team,
    location: tokenData.contact.location,
    
    // Additional Info
    whitepaper: tokenData.whitepaper,
    roadmap: tokenData.roadmap,
    tags: tokenData.tags,
    launch_date: tokenData.launchDate,
    verified: false, // Default to false, admin needs to verify
    
    // Market Data
    initial_price: tokenData.initialPrice,
    liquidity_locked: tokenData.liquidityLocked,
    liquidity_lock_period: tokenData.liquidityLockPeriod,
    
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("meme_coins")
    .insert([tokenRecord])
    .select();

  return { data, error };
};

const getTokens = async () => {
  const { data, error } = await supabase
    .from("meme_coins")
    .select("*")
    .order("created_at", { ascending: false });

  // Transform the data back to our frontend structure
  const transformedData = data?.map(token => ({
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    totalSupply: token.total_supply,
    description: token.description,
    logoImage: token.logo_image,
    bannerImage: token.banner_image,
    network: token.network,
    contractAddress: token.contract_address,
    socials: {
      website: token.website,
      twitter: token.twitter,
      telegram: token.telegram,
      discord: token.discord,
      github: token.github,
      medium: token.medium
    },
    contact: {
      email: token.contact_email,
      team: token.team_name,
      location: token.location
    },
    whitepaper: token.whitepaper,
    roadmap: token.roadmap,
    tags: token.tags,
    launchDate: token.launch_date,
    verified: token.verified,
    initialPrice: token.initial_price,
    liquidityLocked: token.liquidity_locked,
    liquidityLockPeriod: token.liquidity_lock_period,
    createdAt: token.created_at,
    updatedAt: token.updated_at
  }));

  return { data: transformedData, error };
};

const getTokenById = async (id) => {
  const { data, error } = await supabase
    .from("meme_coins")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return { data: null, error };
  }

  // Transform the data back to our frontend structure
  const transformedData = {
    name: data.name,
    symbol: data.symbol,
    decimals: data.decimals,
    totalSupply: data.total_supply,
    description: data.description,
    logoImage: data.logo_image,
    bannerImage: data.banner_image,
    network: data.network,
    contractAddress: data.contract_address,
    socials: {
      website: data.website,
      twitter: data.twitter,
      telegram: data.telegram,
      discord: data.discord,
      github: data.github,
      medium: data.medium
    },
    contact: {
      email: data.contact_email,
      team: data.team_name,
      location: data.location
    },
    whitepaper: data.whitepaper,
    roadmap: data.roadmap,
    tags: data.tags,
    launchDate: data.launch_date,
    verified: data.verified,
    initialPrice: data.initial_price,
    liquidityLocked: data.liquidity_locked,
    liquidityLockPeriod: data.liquidity_lock_period,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };

  return { data: transformedData, error };
};

// Add a function to update token verification status
const verifyToken = async (id) => {
  const { data, error } = await supabase
    .from("meme_coins")
    .update({ verified: true, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select();

  return { data, error };
};

// Add a function to update token metadata
const updateToken = async (id, updateData) => {
  const { data, error } = await supabase
    .from("meme_coins")
    .update({
      ...updateData,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select();

  return { data, error };
};

module.exports = { 
  createToken, 
  getTokens, 
  getTokenById,
  verifyToken,
  updateToken
}; 