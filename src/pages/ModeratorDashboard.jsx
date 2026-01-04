import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomPolling } from '../services/pollingService';
import { startRound, endRound, resetRound, endRoom } from '../services/gameService';
import { joinRoomAsModerator, leaveRoomAsModerator } from '../services/roomService';
import { generateRoomUrl, copyToClipboard } from '../utils/urlUtils';
import { GAME_STATES, GAME_MODES } from '../config/gameConfig';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/shared/LanguageSelector';
import ThemeDisplay from '../components/shared/ThemeDisplay';
import PlayerHand from '../components/player/PlayerHand';
import CardOrderingInterface from '../components/player/CardOrderingInterface';
import Card from '../components/shared/Card';
import ConfirmModal from '../components/shared/ConfirmModal';
import hundoLogoText from '../assets/hundo_logo_text_only.png';
import './ModeratorDashboard.css';
import QRCode from "react-qr-code";

export default function ModeratorDashboard() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { roomData, loading, error, refetch } = useRoomPolling(roomId);
    const [actionLoading, setActionLoading] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [gameMode, setGameMode] = useState(GAME_MODES.ADVENTUROUS);
    const [showEndRoomModal, setShowEndRoomModal] = useState(false);
    const [moderatorPlayerName, setModeratorPlayerName] = useState('');
    const [moderatorPlayerId, setModeratorPlayerId] = useState(null);

    // Load moderator player ID from localStorage
    React.useEffect(() => {
        const savedModeratorPlayerId = localStorage.getItem(`moderatorPlayerId_${roomId}`);
        const savedModeratorPlayerName = localStorage.getItem(`moderatorPlayerName_${roomId}`);
        if (savedModeratorPlayerId && savedModeratorPlayerName) {
            setModeratorPlayerId(savedModeratorPlayerId);
            setModeratorPlayerName(savedModeratorPlayerName);
        }
    }, [roomId]);

    const handleCopyUrl = async () => {
        const url = generateRoomUrl(roomId);
        const success = await copyToClipboard(url);
        if (success) {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const handleJoinAsModerator = async () => {
        if (!moderatorPlayerName.trim()) return;

        setActionLoading(true);
        try {
            const playerId = await joinRoomAsModerator(roomId, moderatorPlayerName.trim());
            setModeratorPlayerId(playerId);
            localStorage.setItem(`moderatorPlayerId_${roomId}`, playerId);
            localStorage.setItem(`moderatorPlayerName_${roomId}`, moderatorPlayerName.trim());
            await refetch();
        } catch (error) {
            alert('Failed to join as player: ' + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleLeaveAsModerator = async () => {
        if (!moderatorPlayerId) return;

        setActionLoading(true);
        try {
            await leaveRoomAsModerator(roomId, moderatorPlayerId);
            setModeratorPlayerId(null);
            setModeratorPlayerName('');
            localStorage.removeItem(`moderatorPlayerId_${roomId}`);
            localStorage.removeItem(`moderatorPlayerName_${roomId}`);
            await refetch();
        } catch (error) {
            alert('Failed to leave as player: ' + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleStartRound = async () => {
        setActionLoading(true);
        try {
            await startRound(roomId, roomData, gameMode);
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

    const handleEndRoom = async () => {
        setShowEndRoomModal(false);
        setActionLoading(true);
        try {
            // Mark room as closed
            await endRoom(roomId);

            // Clear any local storage related to this room
            localStorage.removeItem(`playerId_${roomId}`);
            localStorage.removeItem(`playerName_${roomId}`);
            localStorage.removeItem(`moderatorPlayerId_${roomId}`);
            localStorage.removeItem(`moderatorPlayerName_${roomId}`);

            // Redirect immediately to prevent seeing the closed room state
            navigate('/');
        } catch (error) {
            console.error('Failed to end room:', error);
            setActionLoading(false);
        }
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
            <div className="moderator-dashboard">
                <LanguageSelector />
                <div className="error-message">
                    <h2>{t('playerView.error')}</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const players = roomData?.players || {};
    const playerCount = Object.keys(players).length;
    const gameState = roomData?.gameState;
    const allCards = roomData?.cardOrder || [];
    const isModerator = true; // Always true in moderator dashboard
    const isModeratorPlayer = moderatorPlayerId && players[moderatorPlayerId];
    const moderatorPlayer = isModeratorPlayer ? players[moderatorPlayerId] : null;

    return (
        <div className="moderator-dashboard">
            <LanguageSelector />
            <div className="moderator-header">
                <div className="header-left">
                    <h1>
                        <img src={hundoLogoText} alt="Hundo" className="moderator-logo" />
                        <span> - {t('moderator.moderatorView')}</span>
                    </h1>
                    <div className="room-info">
                        <div className="room-code-display">
                            <span className="label">{t('moderator.roomCode')}</span>
                            <span className="code">{roomId}</span>
                        </div>
                        <button
                            className="btn-outline copy-btn"
                            onClick={handleCopyUrl}
                        >
                            {copySuccess ? t('moderator.copied') : t('moderator.copyPlayerUrl')}
                        </button>
                    </div>
                </div>
                <div className="header-right">
                    <div className="player-count">
                        <span className="count">{playerCount}</span>
                        <span className="label">{t('moderator.players')}</span>
                    </div>
                </div>
            </div>

            <div className="moderator-content">
                <div className="main-area">
                    {gameState === GAME_STATES.WAITING && (
                        <div className="waiting-area">
                            <h2>{t('moderator.waitingToStart')}</h2>
                            <p>{t('moderator.playersWillJoin')}</p>

                            <div style={{ background: 'white', padding: '16px', borderRadius: '8px', margin: '20px auto', width: 'fit-content' }}>
                                <QRCode value={generateRoomUrl(roomId)} size={128} />
                            </div>

                            <div className="moderator-join-section">
                                <h3>{t('moderator.joinAsPlayer')}</h3>
                                {!isModeratorPlayer ? (
                                    <div className="join-form">
                                        <input
                                            type="text"
                                            placeholder={t('moderator.enterYourName')}
                                            value={moderatorPlayerName}
                                            onChange={(e) => setModeratorPlayerName(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleJoinAsModerator()}
                                            disabled={actionLoading}
                                            className="name-input"
                                        />
                                        <button
                                            className="btn-primary"
                                            onClick={handleJoinAsModerator}
                                            disabled={!moderatorPlayerName.trim() || actionLoading}
                                        >
                                            {t('moderator.joinGame')}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="joined-status">
                                        <span className="joined-text">✓ {t('moderator.youJoinedAs')} {moderatorPlayerName}</span>
                                        <button
                                            className="btn-outline btn-small"
                                            onClick={handleLeaveAsModerator}
                                            disabled={actionLoading}
                                        >
                                            {t('moderator.leaveGame')}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {playerCount > 0 && (
                                <div className="players-grid">
                                    {Object.entries(players).map(([id, player]) => (
                                        <div key={id} className={`player-card-waiting ${id === moderatorPlayerId ? 'moderator-player' : ''}`}>
                                            <div className="player-avatar">
                                                {player.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="player-name">
                                                {player.name}
                                                {id === moderatorPlayerId && <span className="moderator-badge"> (You)</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="difficulty-selector">
                                <h3>{t('moderator.selectDifficulty')}</h3>
                                <div className="mode-options">
                                    <label className={`mode-option ${gameMode === GAME_MODES.SIMPLIFIED ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="gameMode"
                                            value={GAME_MODES.SIMPLIFIED}
                                            checked={gameMode === GAME_MODES.SIMPLIFIED}
                                            onChange={(e) => setGameMode(e.target.value)}
                                        />
                                        <div className="mode-content">
                                            <div className="mode-name">{t('moderator.simplified')}</div>
                                            <div className="mode-description">{t('moderator.simplifiedDescription')}</div>
                                        </div>
                                    </label>
                                    <label className={`mode-option ${gameMode === GAME_MODES.ADVENTUROUS ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="gameMode"
                                            value={GAME_MODES.ADVENTUROUS}
                                            checked={gameMode === GAME_MODES.ADVENTUROUS}
                                            onChange={(e) => setGameMode(e.target.value)}
                                        />
                                        <div className="mode-content">
                                            <div className="mode-name">{t('moderator.adventurous')}</div>
                                            <div className="mode-description">{t('moderator.adventurousDescription')}</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button
                                className="btn-success btn-large"
                                onClick={handleStartRound}
                                disabled={playerCount < 2 || actionLoading}
                            >
                                {actionLoading ? t('moderator.starting') : t('moderator.startRound')}
                            </button>

                            {playerCount < 2 && (
                                <p className="warning-text">{t('moderator.needPlayers')}</p>
                            )}
                        </div>
                    )}

                    {gameState === GAME_STATES.PLAYING && (
                        <>
                            <ThemeDisplay
                                themeCard={roomData.themeCard}
                                themeInterval={roomData.themeInterval}
                            />

                            {isModeratorPlayer ? (
                                // Moderator is playing - show player view with moderator controls
                                <div className="moderator-player-view">
                                    <div className="moderator-indicator">
                                        <span className="crown-icon">👑</span>
                                        <span>{t('moderator.youAreModerator')}</span>
                                    </div>

                                    <PlayerHand
                                        cards={moderatorPlayer.cards}
                                        playerName={moderatorPlayerName}
                                        gameMode={roomData.gameMode}
                                    />

                                    <CardOrderingInterface
                                        roomId={roomId}
                                        playerId={moderatorPlayerId}
                                        playerCards={moderatorPlayer.cards}
                                        playerPositions={moderatorPlayer.cardPositions}
                                        allPlayers={roomData.players}
                                    />

                                    <div className="moderator-controls">
                                        <button
                                            className="btn-danger btn-large"
                                            onClick={handleEndRound}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? t('moderator.ending') : t('moderator.endRound')}
                                        </button>
                                        <p className="moderator-note">{t('moderator.onlyYouCanEndRound')}</p>
                                    </div>
                                </div>
                            ) : (
                                // Moderator is not playing - show traditional moderator view
                                <>
                                    <div className="game-area">
                                        <h3>{t('moderator.playerCards')}</h3>
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
                                            <h3>{t('moderator.currentCardOrder')}</h3>
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
                                                            <div className="slot-card">{t('moderator.card')} {card.position !== 999 ? '✓' : '?'}</div>
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
                                        {actionLoading ? t('moderator.ending') : t('moderator.endRound')}
                                    </button>
                                </>
                            )}
                        </>
                    )}

                    {gameState === GAME_STATES.ENDED && (
                        <div className="round-results">
                            <div className={`result-banner ${roomData.isCorrectOrder ? 'success' : 'failure'}`}>
                                {roomData.isCorrectOrder ? (
                                    <>
                                        <div className="result-icon">🎉</div>
                                        <h2>{t('moderator.perfectOrder')}</h2>
                                        <p>{t('moderator.allCardsCorrect')}</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="result-icon">😅</div>
                                        <h2>{t('moderator.notQuiteRight')}</h2>
                                        <p>{t('moderator.notCorrectOrder')}</p>
                                    </>
                                )}
                            </div>

                            <div className="revealed-cards">
                                <h3>{t('moderator.finalCardOrder')}</h3>
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
                                {actionLoading ? t('moderator.resetting') : t('moderator.startNewRound')}
                            </button>
                        </div>
                    )}
                </div>

                <div className="sidebar">
                    <div className="sidebar-section">
                        <h3>{t('moderator.players')}</h3>
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
                                <p className="empty-state">{t('moderator.noPlayers')}</p>
                            )}
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <h3>{t('moderator.gameStatus')}</h3>
                        <div className="status-badge">
                            {gameState === GAME_STATES.WAITING && t('moderator.statusWaiting')}
                            {gameState === GAME_STATES.PLAYING && t('moderator.statusInProgress')}
                            {gameState === GAME_STATES.ENDED && t('moderator.statusRoundEnded')}
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <button
                            className="btn-danger btn-end-room"
                            onClick={() => setShowEndRoomModal(true)}
                            disabled={actionLoading || gameState === GAME_STATES.PLAYING}
                        >
                            {actionLoading ? t('moderator.endingRoom') : t('moderator.endRoom')}
                        </button>
                        {gameState === GAME_STATES.PLAYING && (
                            <p className="sidebar-note">{t('moderator.endRoomDisabledDuringPlay')}</p>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showEndRoomModal}
                title={t('moderator.endRoom')}
                message={t('moderator.endRoomConfirm')}
                confirmText={t('moderator.endRoom')}
                cancelText={t('moderator.cancel')}
                onConfirm={handleEndRoom}
                onCancel={() => setShowEndRoomModal(false)}
                isDanger={true}
            />
        </div>
    );
}
