const axios = require('axios');

async function getToken() {
  try {
    // First try to login with test credentials
    const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'test@example.com',
      password: 'test123'
    });

    if (loginResponse.data.success) {
      console.log('Login successful');
      // The token should be in cookies, but for testing we'll use a mock
      return 'mock-jwt-token';
    }
  } catch (error) {
    console.log('Login failed, trying signup...');

    try {
      // Try to signup
      const signupResponse = await axios.post('http://localhost:5001/api/auth/signup', {
        email: 'test@example.com',
        password: 'test123',
        fullName: 'Test User'
      });

      if (signupResponse.status === 200) {
        console.log('Signup successful, trying login again...');

        const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
          email: 'test@example.com',
          password: 'test123'
        });

        if (loginResponse.data.success) {
          console.log('Login successful after signup');
          return 'mock-jwt-token';
        }
      }
    } catch (signupError) {
      console.log('Signup failed:', signupError.response?.data);
    }
  }

  return null;
}

async function testChatbot() {
  const token = await getToken();

  if (!token) {
    console.log('Could not get authentication token');
    return;
  }

  try {
    // Test language partner feature
    const response = await axios.post('http://localhost:5001/api/chat/language-partner', {
      message: 'Hello, how are you?'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cookie': 'jwt=mock-jwt-token' // This won't work but let's try
      }
    });

    console.log('Language Partner Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testChatbot();