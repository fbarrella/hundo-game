import React from 'react';
import Card from '../shared/Card';
import { GAME_MODES } from '../../config/gameConfig';
import './PlayerHand.css';

export default function PlayerHand({ cards, playerName, gameMode }) {
    if (!cards || cards.length === 0) {
        return null;
    }

    const isSimplified = gameMode === GAME_MODES.SIMPLIFIED;
    const cardLabel = isSimplified ? 'Your Card' : 'Your Cards';
    const hintText = isSimplified
        ? 'Use the scale below to place your card in the correct position'
        : 'Use the scale below to place your cards in the correct order';

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
