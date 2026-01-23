/**
 * Test the complete authentication flow
 */

const API_BASE = 'http://localhost:5005/api';

async function testCompleteFlow() {
  console.log('🧪 Testing Complete Authentication Flow...\n');

  try {
    // Test 1: Health check
    console.log('1. Health check...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health:', healthData.success ? 'PASS' : 'FAIL');
    
    // Test 2: Super Admin Login
    console.log('\n2. Super Admin Login...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: 'super.admin@kutumb.com',
        password: 'Qwerty@123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Super Admin Login:', loginData.success ? 'PASS' : 'FAIL');
    
    if (loginData.success) {
      console.log('   - Global Role:', loginData.user.globalRole);
      console.log('   - Families:', loginData.families?.length || 0);
      
      // Test 3: Regular User Login
      console.log('\n3. Regular User Login...');
      const userLoginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: 'rahul@sharma.com',
          password: 'password123'
        })
      });
      
      const userLoginData = await userLoginResponse.json();
      console.log('✅ Regular User Login:', userLoginData.success ? 'PASS' : 'FAIL');
      
      if (userLoginData.success) {
        console.log('   - Global Role:', userLoginData.user.globalRole);
        console.log('   - Families:', userLoginData.families?.length || 0);
        
        if (userLoginData.families && userLoginData.families.length > 0) {
          console.log('   - Family Details:');
          userLoginData.families.forEach((family, index) => {
            console.log(`     ${index + 1}. ${family.name} (Role: ${family.role})`);
          });
        }
      } else {
        console.log('   - Error:', userLoginData.error);
      }
    } else {
      console.log('   - Error:', loginData.error);
    }
    
    console.log('\n🎉 Complete flow test completed!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testCompleteFlow();