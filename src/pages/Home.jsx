import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../services/roomService';
import './Home.css';

export default function Home() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [joinRoomId, setJoinRoomId] = useState('');

    const handleCreateRoom = async () => {
        setLoading(true);
        try {
            const roomId = await createRoom();
            navigate(`/moderator/${roomId}`);
        } catch (error) {
            alert('Failed to create room: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = () => {
        if (joinRoomId.trim()) {
            navigate(`/play/${joinRoomId.trim().toUpperCase()}`);
        }
    };

    return (
        <div className="home-container">
            <div className="home-content">
                <div className="home-header">
                    <h1 className="game-title">Hundo</h1>
                    <p className="game-subtitle">The Collaborative Card Ordering Game</p>
                </div>

                <div className="home-actions">
                    <div className="action-card">
                        <h2>Host a Game</h2>
                        <p>Create a new room and invite players to join</p>
                        <button
                            className="btn-primary btn-large"
                            onClick={handleCreateRoom}
                            disabled={loading}
                        >
                            {loading ? 'Creating Room...' : 'Create Room (Moderator)'}
                        </button>
                    </div>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <div className="action-card">
                        <h2>Join a Game</h2>
                        <p>Enter the room code to join an existing game</p>
                        <div className="join-form">
                            <input
                                type="text"
                                placeholder="Enter Room Code"
                                value={joinRoomId}
                                onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                                onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                                maxLength={8}
                            />
                            <button
                                className="btn-secondary btn-large"
                                onClick={handleJoinRoom}
                                disabled={!joinRoomId.trim()}
                            >
                                Join Room (Player)
                            </button>
                        </div>
                    </div>
                </div>

                <div className="game-rules">
                    <h3>How to Play</h3>
                    <div className="rules-grid">
                        <div className="rule-item">
                            <div className="rule-number">1</div>
                            <div className="rule-text">
                                <strong>Setup:</strong> Each player receives 2 secret numbered cards (1-100)
                            </div>
                        </div>
                        <div className="rule-item">
                            <div className="rule-number">2</div>
                            <div className="rule-text">
                                <strong>Theme:</strong> A theme card is revealed, setting a creative scale
                            </div>
                        </div>
                        <div className="rule-item">
                            <div className="rule-number">3</div>
                            <div className="rule-text">
                                <strong>Order:</strong> Players arrange all cards in ascending order by describing their cards using the theme
                            </div>
                        </div>
                        <div className="rule-item">
                            <div className="rule-number">4</div>
                            <div className="rule-text">
                                <strong>Win:</strong> If the final order is correct, everyone wins! If not, try again
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
