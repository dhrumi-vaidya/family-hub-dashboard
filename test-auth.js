#!/usr/bin/env node

/**
 * KutumbOS Module 1 Authentication Test Suite
 * Tests all authentication flows and security features
 */

const API_BASE = 'http://localhost:5005/api';

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

async function testHealthCheck() {
  console.log('\n🔍 Testing Health Check...');
  const { status, data } = await makeRequest('/health');
  
  if (status === 200 && data.success) {
    console.log('✅ Health check passed');
    return true;
  } else {
    console.log('❌ Health check failed:', data);
    return false;
  }
}

async function testSuperAdminLogin() {
  console.log('\n🔍 Testing Super Admin Login...');
  const { status, data } = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'super.admin@kutumb.com',
      password: 'Qwerty@123'
    }),
  });
  
  if (status === 200 && data.success && data.user.globalRole === 'SUPER_ADMIN') {
    console.log('✅ Super Admin login successful');
    console.log(`   User: ${data.user.email}`);
    console.log(`   Role: ${data.user.globalRole}`);
    console.log(`   Token: ${data.accessToken.substring(0, 20)}...`);
    return { success: true, token: data.accessToken, refreshToken: data.refreshToken };
  } else {
    console.log('❌ Super Admin login failed:', data);
    return { success: false };
  }
}

async function testFamilyUserLogin() {
  console.log('\n🔍 Testing Family User Login...');
  const { status, data } = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'rahul@sharma.com',
      password: 'password123'
    }),
  });
  
  if (status === 200 && data.success && data.families && data.families.length > 0) {
    console.log('✅ Family User login successful');
    console.log(`   User: ${data.user.email}`);
    console.log(`   Role: ${data.user.globalRole}`);
    console.log(`   Families: ${data.families.length}`);
    data.families.forEach(family => {
      console.log(`     - ${family.name} (${family.role})`);
    });
    return { success: true, token: data.accessToken, refreshToken: data.refreshToken, families: data.families };
  } else {
    console.log('❌ Family User login failed:', data);
    return { success: false };
  }
}

async function testInvalidLogin() {
  console.log('\n🔍 Testing Invalid Login (Account Lockout)...');
  
  // Try 5 wrong passwords with delays to avoid rate limiting
  for (let i = 1; i <= 5; i++) {
    const { status, data } = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'sunita@sharma.com',
        password: 'wrongpassword'
      }),
    });
    
    console.log(`   Attempt ${i}: ${data.error}`);
    
    if (data.error && data.error.includes('attempts remaining')) {
      console.log(`   ✅ Attempt ${i} correctly shows remaining attempts`);
    } else if (data.error && data.error.includes('locked')) {
      console.log('   ✅ Account lockout triggered correctly');
      return true;
    }
    
    // Wait 1 second between attempts to avoid rate limiting
    if (i < 5) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('❌ Account lockout not working properly');
  return false;
}

async function testTokenValidation(token) {
  console.log('\n🔍 Testing Token Validation...');
  const { status, data } = await makeRequest('/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
  
  if (status === 200 && data.success && data.user) {
    console.log('✅ Token validation successful');
    console.log(`   User: ${data.user.email}`);
    return true;
  } else {
    console.log('❌ Token validation failed:', data);
    return false;
  }
}

async function testFamilyContext(token, familyId) {
  console.log('\n🔍 Testing Family Context Validation...');
  console.log(`   Using Family ID: ${familyId}`);
  console.log(`   Using Token: ${token.substring(0, 20)}...`);
  
  const { status, data } = await makeRequest('/auth/validate-family', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Family-ID': familyId
    },
    body: JSON.stringify({ familyId }),
  });
  
  console.log(`   Response Status: ${status}`);
  console.log(`   Response Data:`, data);
  
  if (status === 200 && data.success && data.familyContext) {
    console.log('✅ Family context validation successful');
    console.log(`   Family ID: ${data.familyContext.familyId}`);
    console.log(`   User Role: ${data.familyContext.userRole}`);
    console.log(`   Valid: ${data.familyContext.isValid}`);
    return true;
  } else {
    console.log('❌ Family context validation failed:', data);
    return false;
  }
}

async function testRefreshToken(refreshToken) {
  console.log('\n🔍 Testing Token Refresh...');
  const { status, data } = await makeRequest('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
  
  if (status === 200 && data.success && data.accessToken) {
    console.log('✅ Token refresh successful');
    console.log(`   New Token: ${data.accessToken.substring(0, 20)}...`);
    return { success: true, token: data.accessToken };
  } else {
    console.log('❌ Token refresh failed:', data);
    return { success: false };
  }
}

async function testLogout(token, refreshToken) {
  console.log('\n🔍 Testing Logout...');
  const { status, data } = await makeRequest('/auth/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ refreshToken }),
  });
  
  if (status === 200 && data.success) {
    console.log('✅ Logout successful');
    return true;
  } else {
    console.log('❌ Logout failed:', data);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting KutumbOS Module 1 Authentication Tests\n');
  console.log('=' .repeat(60));
  
  let passedTests = 0;
  let totalTests = 0;
  
  // Test 1: Health Check
  totalTests++;
  if (await testHealthCheck()) passedTests++;
  
  // Test 2: Super Admin Login
  totalTests++;
  const superAdminResult = await testSuperAdminLogin();
  if (superAdminResult.success) passedTests++;
  
  // Test 3: Family User Login
  totalTests++;
  const familyUserResult = await testFamilyUserLogin();
  if (familyUserResult.success) passedTests++;
  
  // Test 4: Invalid Login & Account Lockout
  totalTests++;
  if (await testInvalidLogin()) passedTests++;
  
  // Test 5: Token Validation (if we have a token)
  if (familyUserResult.success) {
    totalTests++;
    if (await testTokenValidation(familyUserResult.token)) passedTests++;
  }
  
  // Test 6: Family Context (if we have a token and families)
  if (familyUserResult.success && familyUserResult.families.length > 0) {
    totalTests++;
    if (await testFamilyContext(familyUserResult.token, familyUserResult.families[0].id)) passedTests++;
  }
  
  // Test 7: Token Refresh (if we have a refresh token)
  if (familyUserResult.success) {
    totalTests++;
    const refreshResult = await testRefreshToken(familyUserResult.refreshToken);
    if (refreshResult.success) passedTests++;
  }
  
  // Test 8: Logout (if we have tokens)
  if (familyUserResult.success) {
    totalTests++;
    if (await testLogout(familyUserResult.token, familyUserResult.refreshToken)) passedTests++;
  }
  
  // Results
  console.log('\n' + '=' .repeat(60));
  console.log('🏁 Test Results Summary');
  console.log('=' .repeat(60));
  console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! Module 1 Authentication is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the implementation.');
  }
  
  console.log('\n📋 Test Coverage:');
  console.log('   ✓ Health Check');
  console.log('   ✓ Super Admin Login');
  console.log('   ✓ Family User Login');
  console.log('   ✓ Account Lockout (5 failed attempts)');
  console.log('   ✓ JWT Token Validation');
  console.log('   ✓ Family Context Validation');
  console.log('   ✓ Token Refresh');
  console.log('   ✓ Logout');
  
  return passedTests === totalTests;
}

// Run tests
runAllTests().catch(console.error);