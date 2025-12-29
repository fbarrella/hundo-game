import React, { useState } from 'react';
import './JoinRoom.css';

export default function JoinRoom({ roomId, onJoin }) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onJoin(name.trim());
        } catch (err) {
            setError(err.message || 'Failed to join room');
            setLoading(false);
        }
    };

    return (
        <div className="join-room-container">
            <div className="join-room-content">
                <h1 className="join-title">Hundo</h1>
                <div className="join-room-code">
                    Room Code: <span>{roomId}</span>
                </div>

                <form onSubmit={handleSubmit} className="join-form-card">
                    <h2>Enter Your Name</h2>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={20}
                        autoFocus
                        disabled={loading}
                    />

                    {error && <div className="error-message">{error}</div>}

                    <button
                        type="submit"
                        className="btn-primary btn-large"
                        disabled={loading || !name.trim()}
                    >
                        {loading ? 'Joining...' : 'Enter Room'}
                    </button>
                </form>

                <div className="join-hint">
                    <p>Make sure you have the correct room code from your game host</p>
                </div>
            </div>
        </div>
    );
}
