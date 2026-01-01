<div align="center">
  <img src="src/assets/hundo_logo.png" alt="Hundo Logo" width="300">
</div>

# Hundo - Multiplayer Card Game

A browser-based collaborative card ordering game where players work together to arrange numbered cards in ascending order using creative theme scales.

![Hundo Game](https://img.shields.io/badge/React-18.3-blue) ![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange) ![Vite](https://img.shields.io/badge/Vite-7.3-purple)

## 🎮 Game Overview

Hundo is a cooperative multiplayer card game where:
- Each player receives 1-2 secret numbered cards (1-100) based on the selected difficulty mode
- A theme card is revealed, setting a creative scale (e.g., "Worst nightmare → Dream come true")
- Players arrange all cards in ascending order by describing their cards using the theme and custom labels
- Visual indicators help players understand the card order (LOWEST → HIGHEST)
- If the final order is correct, everyone wins!

## 🚀 Features

- **Real-time Multiplayer**: Room-based system with shareable URLs and QR codes
- **Difficulty Modes**: Choose between Simplified (1 card) or Adventurous (2 cards) per player
- **Custom Scale Labels**: Players can add personalized descriptions to their cards (e.g., "Spicy foods")
- **Visual Order Indicators**: Clear LOWEST → HIGHEST markers help players arrange cards correctly
- **Moderator View**: Desktop-optimized dashboard for game management
- **Player View**: Mobile-optimized interface with intuitive arrow-based card ordering
- **20 Unique Themes**: Funny and creative scales for each round
- **Beautiful UI**: Modern design with logo integration, animations, and glassmorphism effects
- **Optimized Performance**: Smart database updates (scale labels update on blur to reduce API calls)

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account (free tier works)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hundo-game
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
2. Share the room code, player URL, or QR code with participants
3. Wait for players to join (minimum 2 players)
4. Select difficulty mode:
   - **Simplified**: 1 card per player (easier, faster games)
   - **Adventurous**: 2 cards per player (more challenging)
5. Click **"Start Round"** when ready
6. Monitor the game progress and card ordering
7. Click **"End Round & Reveal"** to see results
8. Start a new round or end the game

### For Players

1. Receive the room code, URL, or scan the QR code from the moderator
2. Enter your name to join the room
3. Wait for the game to start
4. View your secret card(s) (1-2 depending on difficulty) and the theme
5. Use the up/down arrows to position your cards in the overall order
6. Add custom scale labels to describe your cards (e.g., "Spicy foods" for the theme "Disgusting food → Delicious meal")
7. Use the visual indicators (LOWEST at top, HIGHEST at bottom) to guide your ordering
8. Collaborate with other players by sharing your custom labels
9. Wait for the moderator to reveal the results

## 🏗️ Project Structure

```
hundo-game/
├── src/
│   ├── assets/              # Logo images and static assets
│   ├── components/
│   │   ├── shared/          # Reusable components (Card, ThemeDisplay)
│   │   └── player/          # Player-specific components (PlayerHand, CardOrderingInterface)
│   ├── config/              # Game configuration and themes
│   ├── pages/               # Main page components (Home, PlayerView, ModeratorDashboard)
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
  CARDS_PER_PLAYER: 2,      // Default for adventurous mode
  POLLING_INTERVAL: 5000,   // Adjust polling frequency
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 10
};

export const GAME_MODES = {
  SIMPLIFIED: 'simplified',    // 1 card per player
  ADVENTUROUS: 'adventurous'   // 2 cards per player
};
```

## 🔧 Technical Details

- **Frontend**: React 18 with Vite
- **Routing**: React Router DOM
- **QR Codes**: react-qr-code
- **Backend**: Firebase Firestore
- **Styling**: Pure CSS with CSS variables
- **State Management**: React hooks + Firebase polling (5-second intervals)
- **UI Interactions**: Arrow-based card ordering with optimistic updates

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
