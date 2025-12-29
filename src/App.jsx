import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ModeratorDashboard from './pages/ModeratorDashboard';
import PlayerView from './pages/PlayerView';
import './index.css';

function App() {
  return (
    <Router>
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
