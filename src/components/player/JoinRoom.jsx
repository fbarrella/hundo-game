import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from '../shared/LanguageSelector';
import hundoLogoText from '../../assets/hundo_logo_text_only.png';
import './JoinRoom.css';

export default function JoinRoom({ roomId, onJoin }) {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError(t('joinRoom.errorEnterName'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onJoin(name.trim());
        } catch (err) {
            setError(err.message || t('joinRoom.errorJoinFailed'));
            setLoading(false);
        }
    };

    return (
        <div className="join-room-container">
            <LanguageSelector />
            <div className="join-room-content">
                <img src={hundoLogoText} alt="Hundo" className="join-title" />
                <div className="join-room-code">
                    {t('joinRoom.roomCode')} <span>{roomId}</span>
                </div>

                <form onSubmit={handleSubmit} className="join-form-card">
                    <h2>{t('joinRoom.enterYourName')}</h2>
                    <input
                        type="text"
                        placeholder={t('joinRoom.yourNamePlaceholder')}
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
                        {loading ? t('joinRoom.joining') : t('joinRoom.enterRoom')}
                    </button>
                </form>

                <div className="join-hint">
                    <p>{t('joinRoom.hint')}</p>
                </div>
            </div>
        </div>
    );
}
