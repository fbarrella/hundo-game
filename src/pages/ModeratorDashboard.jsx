import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRoomPolling } from '../services/pollingService';
import { startRound, endRound, resetRound } from '../services/gameService';
import { generateRoomUrl, copyToClipboard } from '../utils/urlUtils';
import { GAME_STATES } from '../config/gameConfig';
import ThemeDisplay from '../components/shared/ThemeDisplay';
import Card from '../components/shared/Card';
import './ModeratorDashboard.css';

export default function ModeratorDashboard() {
    const { roomId } = useParams();
    const { roomData, loading, error, refetch } = useRoomPolling(roomId);
    const [actionLoading, setActionLoading] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopyUrl = async () => {
        const url = generateRoomUrl(roomId);
        const success = await copyToClipboard(url);
        if (success) {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const handleStartRound = async () => {
        setActionLoading(true);
        try {
            await startRound(roomId, roomData);
            await refetch();
        } catch (error) {
            alert('Failed to start round: ' + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleEndRound = async () => {
        setActionLoading(true);
        try {
            await endRound(roomId, roomData);
            await refetch();
        } catch (error) {
            alert('Failed to end round: ' + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleNewRound = async () => {
        setActionLoading(true);
        try {
            await resetRound(roomId, roomData);
            await refetch();
        } catch (error) {
            alert('Failed to reset round: ' + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading && !roomData) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading room...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="moderator-dashboard">
                <div className="error-message">
                    <h2>Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const players = roomData?.players || {};
    const playerCount = Object.keys(players).length;
    const gameState = roomData?.gameState;
    const allCards = roomData?.cardOrder || [];

    return (
        <div className="moderator-dashboard">
            <div className="moderator-header">
                <div className="header-left">
                    <h1>Hundo - Moderator View</h1>
                    <div className="room-info">
                        <div className="room-code-display">
                            <span className="label">Room Code:</span>
                            <span className="code">{roomId}</span>
                        </div>
                        <button
                            className="btn-outline copy-btn"
                            onClick={handleCopyUrl}
                        >
                            {copySuccess ? '✓ Copied!' : 'Copy Player URL'}
                        </button>
                    </div>
                </div>
                <div className="header-right">
                    <div className="player-count">
                        <span className="count">{playerCount}</span>
                        <span className="label">Players</span>
                    </div>
                </div>
            </div>

            <div className="moderator-content">
                <div className="main-area">
                    {gameState === GAME_STATES.WAITING && (
                        <div className="waiting-area">
                            <h2>Waiting to Start</h2>
                            <p>Players will join using the room code above</p>

                            {playerCount > 0 && (
                                <div className="players-grid">
                                    {Object.entries(players).map(([id, player]) => (
                                        <div key={id} className="player-card-waiting">
                                            <div className="player-avatar">
                                                {player.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="player-name">{player.name}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                className="btn-success btn-large"
                                onClick={handleStartRound}
                                disabled={playerCount < 2 || actionLoading}
                            >
                                {actionLoading ? 'Starting...' : 'Start Round'}
                            </button>

                            {playerCount < 2 && (
                                <p className="warning-text">Need at least 2 players to start</p>
                            )}
                        </div>
                    )}

                    {gameState === GAME_STATES.PLAYING && (
                        <>
                            <ThemeDisplay
                                themeCard={roomData.themeCard}
                                themeInterval={roomData.themeInterval}
                            />

                            <div className="game-area">
                                <h3>Player Cards</h3>
                                <div className="players-cards-grid">
                                    {Object.entries(players).map(([id, player]) => (
                                        <div key={id} className="player-section">
                                            <div className="player-header-card">
                                                <div className="player-avatar-small">
                                                    {player.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span>{player.name}</span>
                                            </div>
                                            <div className="player-cards">
                                                {player.cards?.map((cardNum, idx) => (
                                                    <Card
                                                        key={idx}
                                                        number={cardNum}
                                                        isRevealed={false}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="current-order">
                                    <h3>Current Card Order</h3>
                                    <div className="order-visualization">
                                        {Object.entries(players).flatMap(([id, player]) =>
                                            player.cards?.map((cardNum, idx) => ({
                                                playerId: id,
                                                playerName: player.name,
                                                cardNumber: cardNum,
                                                position: player.cardPositions?.[idx] ?? 999
                                            }))
                                        )
                                            .sort((a, b) => a.position - b.position)
                                            .map((card, idx) => (
                                                <div key={idx} className="order-slot">
                                                    <div className="slot-number">{idx + 1}</div>
                                                    <div className="slot-player">{card.playerName}</div>
                                                    <div className="slot-card">Card {card.position !== 999 ? '✓' : '?'}</div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>

                            <button
                                className="btn-danger btn-large"
                                onClick={handleEndRound}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Ending...' : 'End Round & Reveal'}
                            </button>
                        </>
                    )}

                    {gameState === GAME_STATES.ENDED && (
                        <div className="round-results">
                            <div className={`result-banner ${roomData.isCorrectOrder ? 'success' : 'failure'}`}>
                                {roomData.isCorrectOrder ? (
                                    <>
                                        <div className="result-icon">🎉</div>
                                        <h2>Perfect Order!</h2>
                                        <p>All cards are in the correct ascending order!</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="result-icon">😅</div>
                                        <h2>Not Quite Right</h2>
                                        <p>The cards are not in the correct order. Try again!</p>
                                    </>
                                )}
                            </div>

                            <div className="revealed-cards">
                                <h3>Final Card Order</h3>
                                <div className="cards-reveal-grid">
                                    {allCards.map((card, idx) => (
                                        <div key={idx} className="revealed-card-item">
                                            <div className="reveal-position">#{idx + 1}</div>
                                            <Card
                                                number={card.cardNumber}
                                                isRevealed={true}
                                                playerName={card.playerName}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                className="btn-primary btn-large"
                                onClick={handleNewRound}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Resetting...' : 'Start New Round'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="sidebar">
                    <div className="sidebar-section">
                        <h3>Players</h3>
                        <div className="players-list">
                            {Object.entries(players).map(([id, player]) => (
                                <div key={id} className="player-list-item">
                                    <div className="player-avatar-small">
                                        {player.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{player.name}</span>
                                    <div className="player-status">●</div>
                                </div>
                            ))}
                            {playerCount === 0 && (
                                <p className="empty-state">No players yet</p>
                            )}
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <h3>Game Status</h3>
                        <div className="status-badge">
                            {gameState === GAME_STATES.WAITING && 'Waiting'}
                            {gameState === GAME_STATES.PLAYING && 'In Progress'}
                            {gameState === GAME_STATES.ENDED && 'Round Ended'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
