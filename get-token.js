const API_BASE = 'http://localhost:5004/api';

async function getToken() {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'rahul@sharma.com',
      password: 'password123'
    }),
  });
  
  const data = await response.json();
  if (data.success) {
    console.log(data.accessToken);
  } else {
    console.error('Login failed:', data);
  }
}

getToken().catch(console.error);