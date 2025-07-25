// Simple test to verify Gemini AI is working
const fetch = require('node-fetch');

const GOOGLE_AI_API_KEY = 'AIzaSyAnnmpFMnh72TN_t34GZVOR9jtLyHpk_78';

async function testGeminiAI() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_AI_API_KEY}`;
  
  const requestBody = {
    contents: [{
      parts: [{
        text: "Hello, can you help me create a simple website?"
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  };

  try {
    console.log('Testing Gemini AI API...');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Gemini API Error:', errorData);
      return false;
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      console.log('✅ Gemini AI is working!');
      console.log('Response:', data.candidates[0].content.parts[0].text);
      return true;
    } else {
      console.error('❌ Unexpected response format:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Network or other error:', error.message);
    return false;
  }
}

testGeminiAI();
