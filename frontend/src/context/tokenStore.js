import { create } from "zustand";
import { createToken, fetchTokens } from "../services/api";

const useTokenStore = create((set) => ({
  tokens: [],
  loading: false,
  error: null,
  
  createNewToken: async (tokenData) => {
    try {
      set({ loading: true, error: null });
      const response = await createToken(tokenData);
      set((state) => ({ 
        tokens: [...state.tokens, response.token],
        loading: false 
      }));
      return response;
    } catch (error) {
      set({ 
        error: error.response?.data?.error || "Failed to create token", 
        loading: false 
      });
      throw error;
    }
  },
  
  loadTokens: async () => {
    try {
      set({ loading: true, error: null });
      const data = await fetchTokens();
      set({ tokens: data, loading: false });
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.error || "Failed to load tokens", 
        loading: false 
      });
      throw error;
    }
  },
}));

export default useTokenStore; 