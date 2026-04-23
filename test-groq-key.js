import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

console.log('Testing Groq API key...');
console.log('API Key starts with:', process.env.GROQ_API_KEY.substring(0, 10) + '...');

try {
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: 'Hello, just testing the API connection' }],
    model: 'llama3-8b-8192',
  });

  console.log('✅ API key works!');
  console.log('Response:', chatCompletion.choices[0]?.message?.content.substring(0, 100) + '...');
} catch (error) {
  console.log('❌ API key error:', error.message);
  console.log('Error status:', error.status);
  console.log('Error type:', error.constructor.name);

  if (error.response) {
    console.log('Response status:', error.response.status);
    console.log('Response data:', error.response.data);
  }
}