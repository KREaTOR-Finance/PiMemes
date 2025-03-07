const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const BASE_URL = 'http://localhost:5000';

// Test specific endpoints
const testEndpoint = async (name, method, url, data = null, headers = {}) => {
  try {
    console.log(`Testing ${name}...`);
    
    const config = {
      method,
      url: url.startsWith('/health') ? `${BASE_URL}${url}` : `${API_URL}${url}`,
      headers,
      data
    };
    
    const response = await axios(config);
    console.log(`✅ ${name}: PASSED`);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.log(`❌ ${name}: FAILED`);
    console.error(error.response?.data || error.message);
    return null;
  }
};

// Run specific tests
const runSpecificTests = async () => {
  console.log('🚀 Starting Specific API Tests...');
  
  // Test health endpoint
  await testEndpoint('Health Check', 'get', '/health');
  
  // Test login
  const loginResponse = await testEndpoint('Login', 'post', '/auth/login', {
    email: 'test@example.com',
    password: 'password123'
  });
  
  if (!loginResponse || !loginResponse.token) {
    console.log('❌ Login failed. Cannot continue with authenticated tests.');
    return;
  }
  
  const token = loginResponse.token;
  const authHeaders = { Authorization: `Bearer ${token}` };
  
  // Test get all tokens
  await testEndpoint('Get All Tokens', 'get', '/token/list');
  
  // Test get token by ID
  await testEndpoint('Get Token By ID', 'get', '/token/1');
  
  // Test get token price history
  await testEndpoint('Get Token Price History', 'get', '/token/1/price-history');
  
  // Test create token
  await testEndpoint('Create Token', 'post', '/token/create', {
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
  }, authHeaders);
  
  console.log('🎉 Specific tests completed!');
};

// Run the tests
runSpecificTests(); 