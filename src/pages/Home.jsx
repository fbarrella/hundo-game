import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../services/roomService';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/shared/LanguageSelector';
import hundoLogo from '../assets/hundo_logo.png';
import './Home.css';

export default function Home() {
    const navigate = useNavigate();
    const { t } = useLanguage();
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
            <LanguageSelector />
            <div className="home-content">
                <div className="home-header">
                    <img src={hundoLogo} alt="Hundo" className="game-title" />
                    <p className="game-subtitle">{t('home.subtitle')}</p>
                </div>

                <div className="home-actions">
                    <div className="action-card">
                        <h2>{t('home.hostGame')}</h2>
                        <p>{t('home.hostDescription')}</p>
                        <button
                            className="btn-primary btn-large"
                            onClick={handleCreateRoom}
                            disabled={loading}
                        >
                            {loading ? t('home.creatingRoom') : t('home.createRoomButton')}
                        </button>
                    </div>

                    <div className="divider">
                        <span>{t('home.or')}</span>
                    </div>

                    <div className="action-card">
                        <h2>{t('home.joinGame')}</h2>
                        <p>{t('home.joinDescription')}</p>
                        <div className="join-form">
                            <input
                                type="text"
                                placeholder={t('home.roomCodePlaceholder')}
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
                                {t('home.joinRoomButton')}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="game-rules">
                    <h3>{t('home.howToPlay')}</h3>
                    <div className="rules-grid">
                        <div className="rule-item">
                            <div className="rule-number">1</div>
                            <div className="rule-text">
                                <strong>{t('home.rule1Title')}</strong> {t('home.rule1Text')}
                            </div>
                        </div>
                        <div className="rule-item">
                            <div className="rule-number">2</div>
                            <div className="rule-text">
                                <strong>{t('home.rule2Title')}</strong> {t('home.rule2Text')}
                            </div>
                        </div>
                        <div className="rule-item">
                            <div className="rule-number">3</div>
                            <div className="rule-text">
                                <strong>{t('home.rule3Title')}</strong> {t('home.rule3Text')}
                            </div>
                        </div>
                        <div className="rule-item">
                            <div className="rule-number">4</div>
                            <div className="rule-text">
                                <strong>{t('home.rule4Title')}</strong> {t('home.rule4Text')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
