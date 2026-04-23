

````markdown
# ✨ BhashaBandhu: Fullstack Chat & Video Calling App ✨

A **real-time chat and video calling platform** designed for **language exchange across Indian states**.  
Users can search for different Indian languages they want to learn, connect with others, and practice via **chatting and video calls**.  

🔗 **Live Link**: [BhashaBandhu](https://bhashabandhu-39oo.onrender.com/)

---

## 🌟 Key Features

* 🌐 **Real-time Messaging** with typing indicators, reactions, and read receipts  
* 📹 **1-on-1 & Group Video Calls** with screen sharing and recording  
* 🤖 **AI Language Partner** – Chat with AI to practice target language conversationally  
* 📝 **Grammar Correction** – Get instant feedback on grammar, spelling, and vocabulary  
* 🔤 **Word Explainer** – Tap any word for pronunciation, meaning, and cultural context  
* 🌐 **Translation Toggle** – Switch between languages seamlessly  
* 🎭 **Cultural Context** – Learn about regional terms and their significance  
* 🎭 **Roleplay Scenarios** – Practice real-life situations like ordering food or bargaining  
* 🌟 **Word of the Day** – Daily language learning challenges via Stories  
* 🏆 **Timed Challenges** – 5-minute speaking challenges with AI evaluation  
* 📖 **24hr Stories** – Share "Word of the Day", pronunciation clips, cultural snippets (auto-expire after 24 hours)
* 👁️ **View Tracking** – See who watched your stories with viewer list  
* 🎨 **Story Reactions** – React with emojis (❤️, 😂, 😍, 🔥, 👏, 🙌)  
* 🧑‍🤝‍🧑 **Language Exchange** – search and connect with learners from different Indian states  
* 🖼️ **Profile Editing** – update bio & upload profile picture securely using **Cloudinary**  
* 🎨 **32 Unique UI Themes** for personalized learning experience  
* 🔐 **Secure Auth** – JWT Authentication & Protected Routes (with bcrypt password hashing)  
* 🧠 **Global State Management** with Zustand  
* ⚡ **Scalable Tech Stack**: React + Express + MongoDB + TailwindCSS + TanStack Query + Groq AI  
* 🚨 Robust **Error Handling** on frontend & backend  
* 🚀 **Deployment Ready** (Vercel + Render)  
* 🎯 Built with **Stream API** for reliable chat & calls  

---

## 🧪 Environment Variables Setup

### Backend (`/backend`)

```ini
PORT=5001
MONGO_URI=your_mongo_uri
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
JWT_SECRET_KEY=your_jwt_secret
NODE_ENV=development

# Groq AI (for chatbot features)
GROQ_API_KEY=your_groq_api_key

# Cloudinary (for profile picture & media uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
````

### Frontend (`/frontend`)

```ini
VITE_STREAM_API_KEY=your_stream_api_key
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## 🔧 Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Then visit 👉 `http://localhost:5173`

---

## � Documentation

- 📱 **[Mobile Optimization Guide](./MOBILE_OPTIMIZATION.md)** – Comprehensive mobile responsiveness documentation  
- 📖 **[Stories Feature Guide](./STORIES_FEATURE.md)** – Complete Stories feature implementation & API reference- 🤖 **[Chatbot Features Guide](./CHATBOT_FEATURES.md)** – AI-powered language learning tools & API endpoints
---

## 📌 Future Enhancements

* 🌍 Add **regional language translation** & AI-based pronunciation practice  
* 📱 Progressive Web App (PWA) for **mobile-first usage**  
* 🏆 Gamification with badges for consistent learners  
* 🤝 Community & Group Learning Rooms  
* 🔍 Advanced story discovery & recommendations  
* 🎙️ Audio-only stories for pronunciation practice  

---

```


