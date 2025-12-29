import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ModeratorDashboard from './pages/ModeratorDashboard';
import PlayerView from './pages/PlayerView';
import './index.css';

function App() {
  // Calculate basename relative to the current path if deployed in a subdirectory
  const getBasename = () => {
    const path = window.location.pathname;
    if (path.includes('/moderator/')) {
      return path.split('/moderator/')[0];
    }
    if (path.includes('/play/')) {
      return path.split('/play/')[0];
    }
    return '/'; // default to root
  };

  return (
    <Router basename={getBasename()}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/moderator/:roomId" element={<ModeratorDashboard />} />
        <Route path="/play/:roomId" element={<PlayerView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

function NotFound() {
  return (
    <div className="loading-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" style={{ color: '#667eea', textDecoration: 'underline' }}>
        Go back home
      </a>
    </div>
  );
}

export default App;
