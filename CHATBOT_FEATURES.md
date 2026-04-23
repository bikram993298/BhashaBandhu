# 🤖 Chatbot Features Guide

BhashaBandhu now includes AI-powered chatbot features to enhance language learning through interactive conversations, corrections, and cultural insights.

## 🌟 Available Features

### 1. AI Language Partner
**Endpoint:** `POST /api/chat/language-partner`
**Description:** Conversational practice with an AI partner who speaks your target language.

**Request Body:**
```json
{
  "message": "Hello, how are you?"
}
```

**Response:**
```json
{
  "response": "नमस्ते, आप कैसे हैं? [Hello, how are you?]"
}
```

### 2. Grammar Correction Mode
**Endpoint:** `POST /api/chat/grammar-correction`
**Description:** Get instant feedback on grammar, spelling, and vocabulary mistakes.

**Request Body:**
```json
{
  "message": "I goed to the store yesterday"
}
```

**Response:**
```json
{
  "response": "✅ Corrected: I went to the store yesterday\n📖 Why: 'Goed' is not the correct past tense of 'go'\n💬 Example: I went to the market last week."
}
```

### 3. Word Explainer
**Endpoint:** `POST /api/chat/word-explainer`
**Description:** Tap any word to get pronunciation, meaning, and cultural context.

**Request Body:**
```json
{
  "word": "नमस्ते"
}
```

**Response:**
```json
{
  "response": "🔤 Word: नमस्ते\n🗣️ Pronunciation: Namaste\n📖 Meaning: Hello/Greetings\n💬 Example: नमस्ते, आप कैसे हैं?\n🌍 Cultural note: A traditional Indian greeting with folded hands"
}
```

### 4. Translation Toggle
**Endpoint:** `POST /api/chat/translation`
**Description:** Translate messages between languages naturally.

**Request Body:**
```json
{
  "message": "Hello, how are you?",
  "sourceLanguage": "English",
  "targetLanguage": "Hindi"
}
```

**Response:**
```json
{
  "response": "नमस्ते, आप कैसे हैं?"
}
```

### 5. Cultural Context Tooltip
**Endpoint:** `POST /api/chat/cultural-context`
**Description:** Learn about regional terms and their cultural significance.

**Request Body:**
```json
{
  "term": "chai"
}
```

**Response:**
```json
{
  "response": "Chai is the Hindi word for tea, which is incredibly popular across India. It's not just a drink but a social ritual - offering chai to guests is a sign of hospitality. This tradition comes from the colonial era when tea was introduced by the British, but Indians made it their own with spices and milk."
}
```

### 6. Roleplay Scenario
**Endpoint:** `POST /api/chat/roleplay`
**Description:** Practice real-life situations through interactive roleplay.

**Request Body:**
```json
{
  "scenario": "ordering food at a restaurant"
}
```

**Response:**
```json
{
  "response": "Waiter: नमस्ते, क्या आप कुछ ऑर्डर करना चाहेंगे? [Hello, would you like to order something?]"
}
```

### 7. Word of the Day
**Endpoint:** `POST /api/chat/word-of-day`
**Description:** Generate daily language learning challenges for Stories.

**Request Body:**
```json
{
  "difficulty": "beginner"
}
```

**Response:**
```json
{
  "response": "🌟 Word of the Day\nखाना /Khana/\nMeaning: Food\n💬 Use it in a sentence: मुझे खाना पसंद है।\n🎯 Challenge: Describe your favorite food using this word!\n🌍 Fun fact: 'Khana' comes from Sanskrit and is used across North India."
}
```

### 8. Timed Challenge Judge
**Endpoint:** `POST /api/chat/challenge-judge`
**Description:** Evaluate 5-minute speaking challenges with detailed feedback.

**Request Body:**
```json
{
  "conversationLog": "User: Hello\nAI: नमस्ते\nUser: How are you\nAI: मैं ठीक हूँ"
}
```

**Response:**
```json
{
  "response": "🎯 Score: 7/10\n✅ What you did well: Good attempt at basic greetings, nice effort!\n📖 Mistakes to fix: Remember to use formal forms with elders\n🔥 Streak words: नमस्ते, कैसे\n💪 Tip for next time: Practice sentence structure more"
}
```

## 🔧 Technical Details

### Authentication
All chatbot endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### User Profile Integration
The AI uses your profile data (native language, target language) to personalize responses. Make sure your profile is complete for the best experience.

### Rate Limiting
- Free tier: 50 requests per hour
- Premium: 500 requests per hour

### Error Handling
All endpoints return standard HTTP status codes:
- `200`: Success
- `401`: Unauthorized (invalid/missing token)
- `500`: AI service temporarily unavailable

### AI Model
Currently using Groq's Llama 3 8B model for fast, reliable responses optimized for language learning.

## 🚀 Integration Examples

### Frontend Integration (React)
```javascript
const chatWithAI = async (message, endpoint) => {
  const response = await fetch(`/api/chat/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({ message })
  });
  
  const data = await response.json();
  return data.response;
};
```

### Mobile App Integration
Use the same REST API endpoints with appropriate authentication headers.

## 📈 Future Enhancements

* 🎙️ Voice input/output for pronunciation practice
* 📊 Progress tracking and learning analytics
* 👥 Multi-user conversation practice
* 🌍 Regional dialect variations
* 🎮 Gamified learning challenges</content>
<parameter name="filePath">d:\Downloads\BhashaBandhu\BhashaBandhu\CHATBOT_FEATURES.md