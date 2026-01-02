import React from 'react';
import Card from '../shared/Card';
import { GAME_MODES } from '../../config/gameConfig';
import { useLanguage } from '../../contexts/LanguageContext';
import './PlayerHand.css';

export default function PlayerHand({ cards, playerName, gameMode }) {
    const { t } = useLanguage();

    if (!cards || cards.length === 0) {
        return null;
    }

    const isSimplified = gameMode === GAME_MODES.SIMPLIFIED;
    const cardLabel = isSimplified ? t('playerHand.yourCard') : t('playerHand.yourCards');
    const hintText = isSimplified
        ? t('playerHand.hintSimplified')
        : t('playerHand.hintAdventurous');

    return (
        <div className="player-hand">
            <h3>{cardLabel}</h3>
            <div className="hand-cards">
                {cards.map((cardNumber, index) => (
                    <div key={index} className="hand-card">
                        <Card
                            number={cardNumber}
                            isRevealed={true}
                            playerName={playerName}
                        />
                    </div>
                ))}
            </div>
            <p className="hand-hint">
                {hintText}
            </p>
        </div>
    );
}
