import { create } from "zustand";
import { persist } from "zustand/middleware";

// Mock wallet data
const mockWalletData = {
  address: "0x7a3B...F92c",
  balance: 1250.45,
  tokens: [
    { symbol: "DOGEPI", balance: 45000, value: 20.25 },
    { symbol: "MOONPI", balance: 32000, value: 10.24 },
    { symbol: "CATPI", balance: 18000, value: 5.04 },
  ]
};

// Create a store with persistence
const useStore = create(
  persist(
    (set, get) => ({
      // Wallet connection state
      isWalletConnected: false,
      walletAddress: null,
      walletBalance: 0,
      walletTokens: [],
      
      // User profile state
      userProfile: null,
      
      // Connect wallet function
      connectWallet: async () => {
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Set wallet state
          set({ 
            isWalletConnected: true,
            walletAddress: mockWalletData.address,
            walletBalance: mockWalletData.balance,
            walletTokens: mockWalletData.tokens
          });
          
          return mockWalletData;
        } catch (error) {
          console.error("Error connecting wallet:", error);
          throw error;
        }
      },
      
      // Disconnect wallet function
      disconnectWallet: () => {
        set({ 
          isWalletConnected: false,
          walletAddress: null,
          walletBalance: 0,
          walletTokens: [],
          // Keep the profile even when disconnected
        });
      },
      
      // Create or update profile
      updateProfile: async (profileData) => {
        return new Promise((resolve) => {
          // Simulate API call delay
          setTimeout(() => {
            const updatedProfile = { ...get().userProfile, ...profileData };
            set({ userProfile: updatedProfile });
            resolve(updatedProfile);
          }, 1000);
        });
      },
      
      // Legacy state (keeping for backward compatibility)
      user: null,
      setUser: (user) => set({ user }),
      
      selectedCoin: "DOGEPI",
      setSelectedCoin: (coin) => set({ selectedCoin: coin }),
      
      balance: 0,
      setBalance: (balance) => set({ balance }),
    }),
    {
      name: "pimemes-storage", // unique name for localStorage
      partialize: (state) => ({
        // Only persist these states
        isWalletConnected: state.isWalletConnected,
        walletAddress: state.walletAddress,
        walletBalance: state.walletBalance,
        walletTokens: state.walletTokens,
        userProfile: state.userProfile,
      }),
    }
  )
);

export default useStore; 