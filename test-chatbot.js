// Test script to verify chatbot API endpoints
const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:5001';
let TEST_TOKEN = null;

const features = [
  'language-partner',
  'grammar-correction',
  'word-explainer',
  'translation',
  'cultural-context',
  'roleplay',
  'word-of-day',
  'challenge-judge'
];

function makeRequest(endpoint, data, useAuth = true) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);

    const options = {
      hostname: 'localhost',
      port: 5001,
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    if (useAuth && TEST_TOKEN) {
      options.headers['Authorization'] = `Bearer ${TEST_TOKEN}`;
    }

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: response });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function signupAndLogin() {
  try {
    console.log('📝 Creating test user...');
    const signupResponse = await makeRequest('/api/auth/signup', {
      email: 'test@example.com',
      password: 'test123',
      fullName: 'Test User'
    }, false);

    if (signupResponse.statusCode !== 200) {
      console.log('User might already exist, trying login...');
    }

    console.log('🔐 Logging in...');
    const loginResponse = await makeRequest('/api/auth/login', {
      email: 'test@example.com',
      password: 'test123'
    }, false);

    if (loginResponse.statusCode === 200 && loginResponse.data.success) {
      // Extract token from cookie (this is a simplified approach)
      // In a real scenario, you'd need to handle cookies properly
      TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzY3ZjYxZjM4MzM4ZjYxZjM4MzM4ZjYxIiwiaWF0IjoxNzM0ODk5MzY3LCJleHAiOjE3MzQ5ODU3Njd9.test'; // We'll use a mock token for now
      console.log('✅ Authentication successful');
      return true;
    } else {
      console.log('❌ Authentication failed:', loginResponse.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Auth error:', error.message);
    return false;
  }
}

async function testEndpoint(feature, message) {
  try {
    const response = await makeRequest(`/api/chat/${feature}`, { message });

    if (response.statusCode === 200 && response.data.response) {
      console.log(`✅ ${feature}: ${response.data.response.substring(0, 100)}...`);
      return true;
    } else {
      console.log(`❌ ${feature}: Status ${response.statusCode} - ${response.data.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${feature}: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing Chatbot API Endpoints...\n');

  // First authenticate
  const authSuccess = await signupAndLogin();
  if (!authSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }

  const testMessages = {
    'language-partner': 'Hello, how are you?',
    'grammar-correction': 'I goed to store yesterday',
    'word-explainer': 'What does नमस्ते mean?',
    'translation': 'Hello world',
    'cultural-context': 'What is chai?',
    'roleplay': 'I want to practice ordering food',
    'word-of-day': 'Give me a word for beginners',
    'challenge-judge': 'I practiced speaking for 5 minutes'
  };

  let passed = 0;
  let total = features.length;

  for (const feature of features) {
    const success = await testEndpoint(feature, testMessages[feature]);
    if (success) passed++;
    await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limiting for AI calls
  }

  console.log(`\n📊 Results: ${passed}/${total} endpoints working`);
  if (passed === total) {
    console.log('🎉 All chatbot features are integrated successfully!');
  } else {
    console.log('⚠️ Some features may need attention');
  }
}

runTests().catch(console.error);