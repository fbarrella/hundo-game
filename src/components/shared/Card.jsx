import React from 'react';
import './Card.css';

/**
 * Card component - displays a game card with number
 * @param {number} number - Card number (1-100)
 * @param {boolean} isRevealed - Whether card is face-up
 * @param {boolean} isThemeCard - Whether this is the theme card
 * @param {string} playerName - Name of player who owns this card
 * @param {string} className - Additional CSS classes
 */
export default function Card({
    number,
    isRevealed = false,
    isThemeCard = false,
    playerName = '',
    className = ''
}) {
    return (
        <div
            className={`card ${isRevealed ? 'revealed' : 'hidden'} ${isThemeCard ? 'theme-card' : ''} ${className}`}
        >
            <div className="card-inner">
                <div className="card-front">
                    <div className="card-number">{number}</div>
                    {playerName && <div className="card-player">{playerName}</div>}
                </div>
                <div className="card-back">
                    <div className="card-pattern">Hundo</div>
                </div>
            </div>
        </div>
    );
}
