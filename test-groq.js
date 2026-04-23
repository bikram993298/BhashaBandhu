import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

console.log('Testing Groq API key...');

try {
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: 'Hello, just testing the API' }],
    model: 'llama3-8b-8192',
  });

  console.log('✅ API key works!');
  console.log('Response:', chatCompletion.choices[0]?.message?.content);
} catch (error) {
  console.log('❌ API key error:', error.message);
  console.log('Full error:', error);
}