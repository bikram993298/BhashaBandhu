

````markdown
# ✨ BhashaBandhu: Fullstack Chat & Video Calling App ✨

A **real-time chat and video calling platform** designed for **language exchange across Indian states**.  
Users can search for different Indian languages they want to learn, connect with others, and practice via **chatting and video calls**.  

🔗 **Live Link**: [BhashaBandhu](https://bhashabandhu-39oo.onrender.com/)

---

## 🌟 Key Features

* 🌐 **Real-time Messaging** with typing indicators, reactions, and read receipts  
* 📹 **1-on-1 & Group Video Calls** with screen sharing and recording  
* 🧑‍🤝‍🧑 **Language Exchange** – search and connect with learners from different Indian states  
* 🖼️ **Profile Editing** – update bio & upload profile picture securely using **Cloudinary**  
* 🎨 **32 Unique UI Themes** for personalized learning experience  
* 🔐 **Secure Auth** – JWT Authentication & Protected Routes (with bcrypt password hashing)  
* 🧠 **Global State Management** with Zustand  
* ⚡ **Scalable Tech Stack**: React + Express + MongoDB + TailwindCSS + TanStack Query  
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

## 📌 Future Enhancements

* 🌍 Add **regional language translation** & AI-based pronunciation practice
* 📱 Progressive Web App (PWA) for **mobile-first usage**
* 🏆 Gamification with badges for consistent learners
* 🤝 Community & Group Learning Rooms

---

```


