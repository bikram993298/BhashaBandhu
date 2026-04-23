# 📖 Stories Feature - Implementation Guide

## Overview

The Stories feature has been fully implemented for BhashaBandhu, allowing users to share **"Word of the Day"**, **pronunciation clips**, and **cultural snippets** that disappear after 24 hours.

---

## 🏗️ Architecture

### Backend Stack
- **Model**: `Story.js` - MongoDB schema with TTL index for auto-expiry
- **Controller**: `story.controller.js` - Business logic for all story operations
- **Routes**: `story.route.js` - Express endpoints for story management
- **Auto-Expiry**: MongoDB TTL index automatically deletes stories after 24 hours

### Frontend Stack
- **API**: `lib/api.js` - Axios functions for story operations
- **Components**: Located in `components/story/`
  - `StoryFeedBar.jsx` - Main entry point, horizontal scroll bar
  - `StoryRing.jsx` - Avatar with colored ring for unviewed stories
  - `StoryViewer.jsx` - Full-screen story viewer with progress bar
  - `StoryCreator.jsx` - Modal for creating stories
  - `StoryProgressBar.jsx` - Progress indicator while viewing

---

## 🔌 API Endpoints

### Story Routes (`/api/stories`)

```
POST   /              - Create story
GET    /feed          - Get story feed (friends' stories)
GET    /user/stories  - Get user's own stories
GET    /:storyId      - View story (tracks viewer)
GET    /:storyId/viewers - Get who viewed the story (author only)
POST   /:storyId/react - React with emoji
DELETE /:storyId      - Delete story (author only)
```

---

## 📦 Database Schema

### Story Model

```javascript
{
  author: ObjectId (ref: User),        // Story creator
  mediaUrl: String,                    // Cloudinary URL (image/video)
  mediaType: String,                   // "image" | "video" | "text"
  textContent: String,                 // Text for text stories
  backgroundColor: String,             // Hex color for text stories
  languageTag: String,                 // e.g., "Tamil", "Hindi"
  viewers: [ObjectId],                 // Array of users who viewed
  reactions: [{
    user: ObjectId,
    emoji: String
  }],
  expiresAt: Date,                     // Auto-deleted by TTL index
  createdAt: Date,
  updatedAt: Date
}
```

**Key Feature**: TTL Index
```javascript
index: { expires: 0 }  // MongoDB auto-deletes 24hrs after creation
```

---

## 🎨 Frontend Components

### 1. **StoryFeedBar** (`components/story/StoryFeedBar.jsx`)
Main horizontal scrollable bar showing friends' story avatars.

**Features**:
- "Add Story" button to create new story
- Friends' avatars with story count
- Colored ring indicator for unviewed stories
- Opens StoryViewer when clicked
- Auto-refreshes every 5 seconds

**Props**: None (hooks data internally)

```jsx
<StoryFeedBar />
```

### 2. **StoryRing** (`components/story/StoryRing.jsx`)
Individual story avatar with ring indicator.

**Features**:
- Colored ring for unviewed stories (primary color)
- Gray ring for viewed stories
- Shows user name and language
- Story count badge

**Props**:
```javascript
{
  user: User,           // User object with profilePic, fullName, nativeLanguage
  stories: Story[],     // Array of stories
  hasUnviewed: Boolean, // Whether user has unviewed stories
  onClick: Function     // Callback when clicked
}
```

### 3. **StoryViewer** (`components/story/StoryViewer.jsx`)
Full-screen modal for viewing stories with interactive features.

**Features**:
- Auto-advances to next story every 5 seconds
- Progress bar showing time remaining
- Keyboard navigation (←/→ arrows, ESC to close)
- View tracking (tracks each viewer)
- Emoji reactions (❤️, 😂, 😍, 🔥, 👏, 🙌)
- View count and viewer list
- Left/right arrows for manual navigation

**Props**:
```javascript
{
  author: User,        // Story author
  stories: Story[],    // Array of stories to view
  onClose: Function,   // Close callback
  onNext: Function     // Move to next author's stories
}
```

**Keyboard Controls**:
- `ArrowLeft` - Previous story
- `ArrowRight` - Next story
- `Escape` - Close viewer

### 4. **StoryCreator** (`components/story/StoryCreator.jsx`)
Modal for creating new stories with multiple content types.

**Features**:
- Three story types: Text, Image, Video
- Language tag selection (auto-populated from LANGUAGES constant)
- Text editor with character counter
- Color picker for text stories
- Live preview for text stories
- Cloudinary upload for images/videos
- Form validation

**Props**:
```javascript
{
  onClose: Function    // Close callback
}
```

**Validation**:
- Language tag is required
- Text content required for text stories (max 500 chars)
- Media required for image/video stories

### 5. **StoryProgressBar** (`components/story/StoryProgressBar.jsx`)
Visual progress indicator at top of story viewer.

**Features**:
- Shows progress for each story
- Segments for multiple stories
- White bars with 5-second animation

**Props**:
```javascript
{
  currentIndex: Number,      // Current story index
  totalStories: Number,      // Total stories count
  autoAdvanceTime: Number    // Time per story in ms (default: 5000)
}
```

---

## 🔄 Data Flow

### Creating a Story
```
User clicks "+" button
     ↓
StoryCreator modal opens
     ↓
User selects type (text/image/video)
User selects language
User adds content
     ↓
POST /api/stories
     ↓
Story created & stored in DB
Story feed refreshes
StoryFeedBar updates
```

### Viewing Stories
```
User clicks friend's avatar
     ↓
StoryViewer modal opens
     ↓
GET /api/stories/:storyId (tracks viewer)
     ↓
Auto-advances every 5 seconds
     ↓
User can react with emoji
POST /api/stories/:storyId/react
     ↓
User can view who watched
GET /api/stories/:storyId/viewers
```

### Auto-Expiry
```
Story created with expiresAt = now + 24 hours
     ↓
(No cron job needed!)
     ↓
MongoDB TTL index monitors expiresAt
     ↓
After 24 hours, MongoDB auto-deletes
```

---

## 🎯 Usage Examples

### Add StoryFeedBar to HomePage
```jsx
import { StoryFeedBar } from "../components/story";

function HomePage() {
  return (
    <div>
      <StoryFeedBar />
      {/* Rest of content */}
    </div>
  );
}
```

### Already Integrated
✅ StoryFeedBar is already added to `pages/HomePage.jsx`

---

## 🧪 Testing Checklist

### Backend
- [ ] Create story with text
- [ ] Create story with image
- [ ] Create story with video
- [ ] View story (check viewers array updated)
- [ ] React to story (check reactions array)
- [ ] Get story viewers (only author can access)
- [ ] Delete story (only author can delete)
- [ ] Get story feed (only friends' stories + own)
- [ ] Verify TTL index deletes story after 24 hours

### Frontend
- [ ] Create text story with color picker
- [ ] Create image story with Cloudinary upload
- [ ] Create video story with Cloudinary upload
- [ ] View story auto-advances every 5 seconds
- [ ] Progress bar animates correctly
- [ ] React with emoji
- [ ] View who watched story
- [ ] Keyboard navigation (arrows, escape)
- [ ] Story ring shows colored ring for unviewed
- [ ] Story feed refreshes automatically

---

## 🎨 BhashaBandhu-Specific Story Types

Users can create stories for:

| Type | Example |
|------|---------|
| 🗣️ **Word of the Day** | Post a word in Tamil/Hindi with pronunciation |
| 🎤 **Pronounce This** | Audio/video clip showing correct pronunciation |
| 🏛️ **Culture Byte** | Share a cultural fact or festival info |
| 🧪 **Quiz Story** | Post a word, viewers guess the meaning |
| 📚 **Grammar Tip** | Quick grammar rule or language learning tip |
| 🎭 **Idiom Story** | Explain common idioms with examples |

---

## ⚙️ Configuration

### Environment Variables
```env
# Frontend (.env)
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Backend (.env)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Language Tags
Stories use the existing LANGUAGES constant from `constants/index.js`:
```javascript
export const LANGUAGES = [
  "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam",
  "Marathi", "Gujarati", "Bengali", "Punjabi", "Urdu",
  // ... more languages
];
```

---

## 🚀 Performance Optimizations

1. **TTL Index** - MongoDB auto-deletes expired stories (no cron job)
2. **Lazy Loading** - Story viewer only loads current story content
3. **Query Optimization** - Only fetch non-expired stories
4. **Pagination Ready** - Can add pagination if many stories
5. **Image Optimization** - Cloudinary handles image resizing

---

## 🔒 Security

- ✅ Only authenticated users can create stories
- ✅ Only story author can see viewer list
- ✅ Only story author can delete their story
- ✅ Media uploaded to Cloudinary (not local storage)
- ✅ TTL index prevents data bloat
- ✅ User isolation - can only see friends' stories

---

## 🐛 Troubleshooting

### Issue: Stories not appearing
**Solution**: 
- Check if backend is running
- Verify API endpoint is correct
- Check browser console for errors
- Verify friendship relationship exists

### Issue: Upload fails
**Solution**:
- Verify Cloudinary credentials in `.env`
- Check file size limits
- Ensure upload preset exists
- Check internet connection

### Issue: Auto-expiry not working
**Solution**:
- Verify MongoDB TTL index exists
- Check MongoDB version (TTL requires 2.2+)
- Index may take up to 1 minute to process deletion

### Issue: Reactions not saving
**Solution**:
- Verify user is authenticated
- Check story exists and not expired
- Verify MongoDB connection
- Check backend logs for errors

---

## 📱 Mobile Responsive

All story components are fully responsive:
- ✅ StoryViewer fits mobile screens
- ✅ StoryFeedBar horizontal scroll works on mobile
- ✅ StoryCreator modal optimized for mobile
- ✅ Touch-friendly buttons and interactions

---

## 🔮 Future Enhancements

- [ ] Story collections (organize by date)
- [ ] Story polls/voting
- [ ] Story mentions (@username)
- [ ] Story hashtags
- [ ] Story filters (by language)
- [ ] Story archives (view past stories)
- [ ] Story notifications
- [ ] Story analytics for creators
- [ ] Story collaboration (multi-author stories)

---

## 📖 Component File Locations

```
frontend/
├── src/
│   ├── components/
│   │   └── story/
│   │       ├── index.js                  (barrel export)
│   │       ├── StoryFeedBar.jsx          (main component)
│   │       ├── StoryRing.jsx             (avatar with ring)
│   │       ├── StoryViewer.jsx           (viewer modal)
│   │       ├── StoryCreator.jsx          (creator modal)
│   │       └── StoryProgressBar.jsx      (progress indicator)
│   ├── lib/
│   │   └── api.js                        (story API functions)
│   └── pages/
│       └── HomePage.jsx                  (integrated StoryFeedBar)
backend/
├── src/
│   ├── models/
│   │   └── Story.js                      (mongoose schema)
│   ├── controllers/
│   │   └── story.controller.js           (business logic)
│   ├── routes/
│   │   └── story.route.js                (express endpoints)
│   └── server.js                         (integrated routes)
```

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Set all environment variables
- [ ] Test all CRUD operations
- [ ] Verify Cloudinary uploads work
- [ ] Test on mobile devices
- [ ] Verify TTL index exists in MongoDB
- [ ] Test 24-hour expiry (or use shorter time for testing)
- [ ] Load test with multiple concurrent story views
- [ ] Test with slow network (throttle in DevTools)
- [ ] Verify error handling works
- [ ] Check CORS settings for API

---

Last Updated: April 2026
