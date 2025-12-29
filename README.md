# Hundo - Multiplayer Card Game

A browser-based collaborative card ordering game where players work together to arrange numbered cards in ascending order using creative theme scales.

![Hundo Game](https://img.shields.io/badge/React-18.3-blue) ![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange) ![Vite](https://img.shields.io/badge/Vite-7.3-purple)

## 🎮 Game Overview

Hundo is a cooperative multiplayer card game where:
- Each player receives 2 secret numbered cards (1-100)
- A theme card is revealed, setting a creative scale (e.g., "Worst nightmare → Dream come true")
- Players must arrange all cards in ascending order by describing their cards using the theme
- If the final order is correct, everyone wins!

## 🚀 Features

- **Real-time Multiplayer**: Room-based system with shareable URLs
- **Moderator View**: Desktop-optimized dashboard for game management
- **Player View**: Mobile-optimized interface for gameplay
- **Drag & Drop**: Intuitive card ordering interface
- **20 Unique Themes**: Funny and creative scales for each round
- **Beautiful UI**: Modern design with animations and glassmorphism effects

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account (free tier works)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd /home/fenetto/Documents/Repos/js/ito-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   a. Create a new Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   
   b. Enable Firestore Database:
      - Go to "Build" → "Firestore Database"
      - Click "Create database"
      - Start in **test mode** (for development)
      - Choose a location
   
   c. Get your Firebase configuration:
      - Go to Project Settings (gear icon)
      - Scroll down to "Your apps"
      - Click the web icon (</>) to create a web app
      - Copy the configuration object
   
   d. Update `src/services/firebase.js`:
      ```javascript
      const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
      };
      ```

4. **Set up Firestore Security Rules** (Important!)
   
   Go to Firestore Database → Rules and update:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /rooms/{roomId} {
         allow read, write: if true; // For development
         // For production, add proper authentication
       }
     }
   }
   ```

## 🎯 Running the Application

### Development Mode
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## 🎲 How to Play

### For Moderators (Game Host)

1. Open the application and click **"Create Room (Moderator)"**
2. Share the room code or player URL with participants
3. Wait for players to join
4. Click **"Start Round"** when ready (minimum 2 players)
5. Monitor the game progress and card ordering
6. Click **"End Round & Reveal"** to see results
7. Start a new round or end the game

### For Players

1. Receive the room code or URL from the moderator
2. Enter your name to join the room
3. Wait for the game to start
4. View your 2 secret cards and the theme
5. Drag your cards to position them in the overall order
6. Describe your cards using the theme scale to help others
7. Wait for the moderator to reveal the results

## 🏗️ Project Structure

```
ito-game/
├── src/
│   ├── components/
│   │   ├── shared/          # Reusable components (Card, ThemeDisplay)
│   │   ├── player/          # Player-specific components
│   │   └── moderator/       # Moderator-specific components
│   ├── config/              # Game configuration and themes
│   ├── pages/               # Main page components
│   ├── services/            # Firebase and game logic services
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
└── package.json             # Dependencies
```

## 🎨 Customization

### Modifying Themes

Edit `src/config/themes.js` to customize the 20 theme scales:

```javascript
{
  interval: 0,
  range: [1, 5],
  scale: "Your custom scale here"
}
```

### Adjusting Game Settings

Edit `src/config/gameConfig.js`:

```javascript
export const GAME_CONFIG = {
  TOTAL_CARDS: 100,
  CARDS_PER_PLAYER: 2,
  POLLING_INTERVAL: 5000,  // Adjust polling frequency
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 10
};
```

## 🔧 Technical Details

- **Frontend**: React 18 with Vite
- **Routing**: React Router DOM
- **Drag & Drop**: @dnd-kit
- **Backend**: Firebase Firestore
- **Styling**: Pure CSS with CSS variables
- **State Management**: React hooks + Firebase polling (5-second intervals)

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify your Firebase configuration in `src/services/firebase.js`
- Check Firestore security rules
- Ensure Firestore is enabled in your Firebase project

### Cards Not Updating
- Check browser console for errors
- Verify polling is working (5-second intervals)
- Ensure multiple players are in the same room

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version: `node --version` (should be v18+)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new themes
- Improve UI/UX
- Add new features

## 🎉 Credits

Created as a digital implementation of the Hundo card game concept.

---

**Enjoy playing Hundo!** 🎴✨
