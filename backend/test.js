const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let authToken = '';
let userId = '';

// Test user credentials
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  pi_wallet_address: '0xtest'
};

// Test token data
const testToken = {
  name: 'Test Coin',
  symbol: 'TEST',
  supply: 1000000000,
  minting: true,
  marketingTax: 2,
  liquidityTax: 2,
  devTax: 1,
  creatorWallet: '0xtest',
  creatorAllocation: 10,
  initialLiquidity: 1000
};

// Helper function to log test results
const logTest = (name, success, error = null) => {
  if (success) {
    console.log(`✅ ${name}: PASSED`);
  } else {
    console.log(`❌ ${name}: FAILED`);
    if (error) {
      console.error(error.message || error);
    }
  }
};

// Test health endpoint
const testHealth = async () => {
  try {
    const response = await axios.get(`${API_URL.replace('/api', '')}/health`);
    logTest('Health Check', response.status === 200 && response.data.status === 'ok');
    return true;
  } catch (error) {
    logTest('Health Check', false, error);
    return false;
  }
};

// Test user signup
const testSignup = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, testUser);
    logTest('User Signup', response.status === 201 && response.data.message.includes('registered'));
    return true;
  } catch (error) {
    // If user already exists, that's okay for testing
    if (error.response && error.response.data && error.response.data.error && error.response.data.error.includes('already exists')) {
      logTest('User Signup', true, 'User already exists, continuing with tests');
      return true;
    }
    logTest('User Signup', false, error);
    return false;
  }
};

// Test user login
const testLogin = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    authToken = response.data.token;
    userId = response.data.user.id;
    
    logTest('User Login', response.status === 200 && authToken);
    return true;
  } catch (error) {
    logTest('User Login', false, error);
    return false;
  }
};

// Test get current user
const testGetCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    logTest('Get Current User', response.status === 200 && response.data.user);
    return true;
  } catch (error) {
    logTest('Get Current User', false, error);
    return false;
  }
};

// Test create token
const testCreateToken = async () => {
  try {
    const response = await axios.post(`${API_URL}/token/create`, testToken, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    logTest('Create Token', response.status === 201 && response.data.message.includes('Created'));
    return response.data.token;
  } catch (error) {
    logTest('Create Token', false, error);
    return null;
  }
};

// Test get all tokens
const testGetAllTokens = async () => {
  try {
    const response = await axios.get(`${API_URL}/token/list`);
    
    logTest('Get All Tokens', response.status === 200 && Array.isArray(response.data));
    return response.data;
  } catch (error) {
    logTest('Get All Tokens', false, error);
    return null;
  }
};

// Test get token by ID
const testGetTokenById = async (tokenId) => {
  try {
    const response = await axios.get(`${API_URL}/token/${tokenId}`);
    
    logTest('Get Token By ID', response.status === 200 && response.data.id === tokenId);
    return response.data;
  } catch (error) {
    logTest('Get Token By ID', false, error);
    return null;
  }
};

// Test get token price history
const testGetTokenPriceHistory = async (tokenId) => {
  try {
    const response = await axios.get(`${API_URL}/token/${tokenId}/price-history`);
    
    logTest('Get Token Price History', response.status === 200 && Array.isArray(response.data));
    return response.data;
  } catch (error) {
    logTest('Get Token Price History', false, error);
    return null;
  }
};

// Run all tests
const runTests = async () => {
  console.log('🚀 Starting PiMemes API Tests...');
  
  // Basic health check
  const healthOk = await testHealth();
  if (!healthOk) {
    console.log('❌ Health check failed. Make sure the server is running.');
    return;
  }
  
  // Auth tests
  await testSignup();
  const loginOk = await testLogin();
  if (!loginOk) {
    console.log('❌ Login failed. Cannot continue with authenticated tests.');
    return;
  }
  
  await testGetCurrentUser();
  
  // Token tests
  const token = await testCreateToken();
  const tokens = await testGetAllTokens();
  
  if (tokens && tokens.length > 0) {
    const tokenId = tokens[0].id;
    await testGetTokenById(tokenId);
    await testGetTokenPriceHistory(tokenId);
  }
  
  console.log('🎉 Tests completed!');
};

// Run the tests
runTests(); 