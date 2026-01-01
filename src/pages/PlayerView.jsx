import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRoomPolling } from '../services/pollingService';
import { joinRoom } from '../services/roomService';
import { GAME_STATES } from '../config/gameConfig';
import JoinRoom from '../components/player/JoinRoom';
import PlayerHand from '../components/player/PlayerHand';
import CardOrderingInterface from '../components/player/CardOrderingInterface';
import ThemeDisplay from '../components/shared/ThemeDisplay';
import Card from '../components/shared/Card';
import './PlayerView.css';

export default function PlayerView() {
    const { roomId } = useParams();
    const [playerId, setPlayerId] = useState(null);
    const [playerName, setPlayerName] = useState('');
    const { roomData, loading, error } = useRoomPolling(roomId);

    // Load player ID from localStorage
    useEffect(() => {
        const savedPlayerId = localStorage.getItem(`playerId_${roomId}`);
        const savedPlayerName = localStorage.getItem(`playerName_${roomId}`);
        if (savedPlayerId && savedPlayerName) {
            setPlayerId(savedPlayerId);
            setPlayerName(savedPlayerName);
        }
    }, [roomId]);

    const handleJoinRoom = async (name) => {
        try {
            const newPlayerId = await joinRoom(roomId, name);
            setPlayerId(newPlayerId);
            setPlayerName(name);
            localStorage.setItem(`playerId_${roomId}`, newPlayerId);
            localStorage.setItem(`playerName_${roomId}`, name);
        } catch (err) {
            throw err;
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
            <div className="player-view">
                <div className="error-message">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <p>Room code: {roomId}</p>
                </div>
            </div>
        );
    }

    if (!playerId || !roomData?.players?.[playerId]) {
        return <JoinRoom roomId={roomId} onJoin={handleJoinRoom} />;
    }

    const player = roomData.players[playerId];
    const gameState = roomData.gameState;

    return (
        <div className="player-view">
            <div className="player-header">
                <div className="player-info">
                    <h3>{playerName}</h3>
                    <div className="room-code">Room: {roomId}</div>
                </div>
            </div>

            <div className="player-content">
                {gameState === GAME_STATES.WAITING && (
                    <div className="waiting-state">
                        <div className="waiting-icon">⏳</div>
                        <h2>Waiting for game to start...</h2>
                        <p>Players in room: {Object.keys(roomData.players).length}</p>
                        <div className="player-list">
                            {Object.values(roomData.players).map((p, idx) => (
                                <div key={idx} className="player-chip">
                                    {p.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {gameState === GAME_STATES.PLAYING && (
                    <>
                        <ThemeDisplay
                            themeCard={roomData.themeCard}
                            themeInterval={roomData.themeInterval}
                        />

                        <PlayerHand
                            cards={player.cards}
                            playerName={playerName}
                            gameMode={roomData.gameMode}
                        />

                        <CardOrderingInterface
                            roomId={roomId}
                            playerId={playerId}
                            playerCards={player.cards}
                            playerPositions={player.cardPositions}
                            allPlayers={roomData.players}
                        />
                    </>
                )}

                {gameState === GAME_STATES.ENDED && (
                    <div className="round-ended">
                        <div className={`result-banner ${roomData.isCorrectOrder ? 'success' : 'failure'}`}>
                            {roomData.isCorrectOrder ? (
                                <>
                                    <div className="result-icon">🎉</div>
                                    <h2>Perfect Order!</h2>
                                    <p>Everyone wins!</p>
                                </>
                            ) : (
                                <>
                                    <div className="result-icon">😅</div>
                                    <h2>Not Quite Right</h2>
                                    <p>Let's try again!</p>
                                </>
                            )}
                        </div>

                        <div className="final-order">
                            <h3>Final Card Order</h3>
                            <div className="cards-reveal">
                                {roomData.cardOrder?.map((card, idx) => (
                                    <div key={idx} className="card-reveal-item">
                                        <Card
                                            number={card.cardNumber}
                                            isRevealed={true}
                                            playerName={card.playerName}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p className="waiting-text">Waiting for moderator to start next round...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
