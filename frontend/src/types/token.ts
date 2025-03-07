export interface TokenSocials {
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  github?: string;
  medium?: string;
}

export interface TokenContact {
  email?: string;
  team?: string;
  location?: string;
}

export interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  description: string;
  
  // Images
  logoImage: string; // Main token logo
  bannerImage?: string; // Optional banner for token page
  
  // Chain Info
  network: string; // e.g. "Pi Network"
  contractAddress: string;
  
  // Links & Socials
  socials: TokenSocials;
  
  // Project Info
  contact: TokenContact;
  whitepaper?: string;
  roadmap?: string;
  
  // Additional Metadata
  tags?: string[]; // e.g. ["meme", "defi", "gaming"]
  launchDate: string;
  verified: boolean;
  
  // Market Data
  initialPrice?: string;
  liquidityLocked?: boolean;
  liquidityLockPeriod?: number; // in days
}

export interface TokenFormData extends Omit<TokenMetadata, 'verified'> {
  // Form specific fields
  logoImageFile?: File;
  bannerImageFile?: File;
} 