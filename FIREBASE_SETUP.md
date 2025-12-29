# Firebase Setup Guide for Hundo Game

## Step-by-Step Firebase Configuration

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" or "Create a project"
3. Enter project name: `ito-game` (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

### 2. Enable Firestore Database

1. In your Firebase project, click "Build" in the left sidebar
2. Click "Firestore Database"
3. Click "Create database"
4. **Choose a location** (select closest to your users)
5. **Start in test mode** for development
   - Test mode allows read/write access for 30 days
   - We'll update security rules later
6. Click "Enable"

### 3. Get Your Firebase Configuration

1. Click the gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>` to add a web app
5. Register app:
   - App nickname: `Hundo Game Web`
   - Don't check "Firebase Hosting" (not needed)
6. Click "Register app"
7. **Copy the configuration object** that looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### 4. Update Your Project

1. Open `src/services/firebase.js` in your code editor
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_ACTUAL_PROJECT_ID",
  storageBucket: "YOUR_ACTUAL_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID"
};
```

### 5. Set Up Firestore Security Rules

#### For Development (Testing)

1. Go to Firestore Database → Rules tab
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rooms/{roomId} {
      // Allow anyone to read and write rooms for testing
      allow read, write: if true;
    }
  }
}
```

3. Click "Publish"

#### For Production (Recommended)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rooms/{roomId} {
      // Allow read access to anyone
      allow read: if true;
      
      // Allow create for new rooms
      allow create: if request.resource.data.keys().hasAll(['roomId', 'createdAt', 'gameState', 'players']);
      
      // Allow updates only to existing rooms
      allow update: if resource != null;
      
      // Prevent deletion in production
      allow delete: if false;
    }
  }
}
```

### 6. Firestore Data Structure

The app will automatically create documents with this structure:

```
rooms (collection)
  └── {roomId} (document)
      ├── roomId: string
      ├── createdAt: timestamp
      ├── gameState: "waiting" | "playing" | "ended"
      ├── themeCard: number (1-100)
      ├── themeInterval: number (0-19)
      ├── isCorrectOrder: boolean
      ├── cardOrder: array
      └── players: object
          └── {playerId}: object
              ├── name: string
              ├── cards: array [number, number]
              ├── cardPositions: array [number, number]
              └── joinedAt: string
```

### 7. Verify Setup

1. Start your development server: `npm run dev`
2. Open the app in your browser
3. Create a room
4. Go to Firebase Console → Firestore Database
5. You should see a new document in the `rooms` collection

### 8. Monitor Usage (Optional)

1. Go to Firebase Console → Firestore Database → Usage tab
2. Monitor:
   - Document reads/writes
   - Storage usage
   - Network egress

**Free tier limits:**
- 50,000 reads/day
- 20,000 writes/day
- 1 GB storage
- 10 GB/month network egress

For a small game with 5-second polling and 10 players:
- ~17,280 reads/day (within free tier)
- Writes only on player actions (well within limits)

### 9. Troubleshooting

**Error: "Firebase: Error (auth/invalid-api-key)"**
- Check that you copied the API key correctly
- Ensure no extra spaces or quotes

**Error: "Missing or insufficient permissions"**
- Check Firestore security rules
- Ensure rules are published
- Try test mode rules first

**Data not updating**
- Check browser console for errors
- Verify Firebase config is correct
- Check network tab for Firestore requests

**Room not found**
- Ensure Firestore is enabled
- Check that room creation succeeded
- Verify room ID matches

### 10. Next Steps

Once Firebase is configured:
1. Test creating a room
2. Join from multiple devices/browsers
3. Test the full game flow
4. Update security rules for production
5. Consider adding authentication for moderators

---

**Need Help?**
- [Firebase Documentation](https://firebase.google.com/docs/firestore)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- Check the browser console for detailed error messages
