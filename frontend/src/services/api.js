import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Market data endpoints
export const fetchMarketData = async (meme_coin_id) => {
  const response = await axios.get(`${API_URL}/token-market-data/${meme_coin_id}`);
  return response.data;
};

export const tradeMemeCoin = async (user, coin, amount, isBuy) => {
  const response = await axios.post(`${API_URL}/trade`, {
    user,
    coin,
    amount,
    isBuy,
  });
  return response.data;
};

// Token creation endpoints
export const createToken = async (tokenData) => {
  const response = await axios.post(`${API_URL}/token/create`, tokenData);
  return response.data;
};

export const fetchTokens = async () => {
  const response = await axios.get(`${API_URL}/token/list`);
  return response.data;
}; 