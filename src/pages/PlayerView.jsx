import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomPolling } from '../services/pollingService';
import { joinRoom } from '../services/roomService';
import { GAME_STATES } from '../config/gameConfig';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/shared/LanguageSelector';
import JoinRoom from '../components/player/JoinRoom';
import PlayerHand from '../components/player/PlayerHand';
import CardOrderingInterface from '../components/player/CardOrderingInterface';
import ThemeDisplay from '../components/shared/ThemeDisplay';
import Card from '../components/shared/Card';
import './PlayerView.css';

export default function PlayerView() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();
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

    const handleReturnHome = () => {
        // Clear local storage for this room
        localStorage.removeItem(`playerId_${roomId}`);
        localStorage.removeItem(`playerName_${roomId}`);
        navigate('/');
    };

    if (loading && !roomData) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>{t('playerView.loadingRoom')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="player-view">
                <LanguageSelector />
                <div className="error-message">
                    <h2>{t('playerView.error')}</h2>
                    <p>{error.toLowerCase().includes('closed') ? t('playerView.roomEnded') : error}</p>
                    <p>{t('playerView.room')} {roomId}</p>
                    <button className="btn-primary" onClick={handleReturnHome}>
                        {t('playerView.returnHome')}
                    </button>
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
            <LanguageSelector />
            <div className="player-header">
                <div className="player-info">
                    <h3>{playerName}</h3>
                    <div className="room-code">{t('playerView.room')} {roomId}</div>
                </div>
            </div>

            <div className="player-content">
                {gameState === GAME_STATES.WAITING && (
                    <div className="waiting-state">
                        <div className="waiting-icon">⏳</div>
                        <h2>{t('playerView.waitingToStart')}</h2>
                        <p>{t('playerView.playersInRoom')} {Object.keys(roomData.players).length}</p>
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
                                    <h2>{t('playerView.perfectOrder')}</h2>
                                    <p>{t('playerView.everyoneWins')}</p>
                                </>
                            ) : (
                                <>
                                    <div className="result-icon">😅</div>
                                    <h2>{t('playerView.notQuiteRight')}</h2>
                                    <p>{t('playerView.tryAgain')}</p>
                                </>
                            )}
                        </div>

                        <div className="final-order">
                            <h3>{t('playerView.finalCardOrder')}</h3>
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

                        <p className="waiting-text">{t('playerView.waitingForModerator')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
