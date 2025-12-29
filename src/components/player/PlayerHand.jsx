import React from 'react';
import Card from '../shared/Card';
import './PlayerHand.css';

export default function PlayerHand({ cards, playerName }) {
    if (!cards || cards.length === 0) {
        return null;
    }

    return (
        <div className="player-hand">
            <h3>Your Cards</h3>
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
                Use the scale below to place your cards in the correct order
            </p>
        </div>
    );
}
