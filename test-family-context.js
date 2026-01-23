const API_BASE = 'http://localhost:5004/api';

async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  console.log(`Making request to: ${url}`);
  if (options.body) {
    console.log(`Request body: ${options.body}`);
  }
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  const data = await response.json();
  return { status: response.status, data };
}

async function testFamilyContext() {
  // First login
  console.log('Logging in...');
  const loginResponse = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'rahul@sharma.com',
      password: 'password123'
    }),
  });
  
  if (!loginResponse.data.success) {
    console.log('Login failed:', loginResponse.data);
    return;
  }
  
  const token = loginResponse.data.accessToken;
  const familyId = loginResponse.data.families[0].id;
  
  console.log(`Token: ${token.substring(0, 30)}...`);
  console.log(`Family ID: ${familyId}`);
  
  // Test family context
  console.log('\nTesting family context validation...');
  const { status, data } = await makeRequest('/auth/validate-family', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Family-ID': familyId
    },
    body: JSON.stringify({ familyId }),
  });
  
  console.log(`Response Status: ${status}`);
  console.log(`Response Data:`, JSON.stringify(data, null, 2));
}

testFamilyContext().catch(console.error);