# Environment Variables Setup

This project uses environment variables to store Firebase configuration securely.

## Setup Instructions

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values with your actual Firebase credentials:
   ```
   VITE_FIREBASE_API_KEY=AIzaSyDPbLx5sHepEMkf8xoF8gLg-1-soeshYCw
   VITE_FIREBASE_AUTH_DOMAIN=hundo-game.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=hundo-game
   VITE_FIREBASE_STORAGE_BUCKET=hundo-game.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=383681311640
   VITE_FIREBASE_APP_ID=1:383681311640:web:b815579521a4635800f1ed
   ```

3. The `.env.local` file is gitignored and will not be committed to version control.

## Important Notes

- All environment variables must be prefixed with `VITE_` to be accessible in the Vite application
- Never commit `.env.local` to version control
- Share the `.env.example` file with your team, but keep actual credentials in `.env.local`
- After creating or modifying `.env.local`, restart your development server for changes to take effect
