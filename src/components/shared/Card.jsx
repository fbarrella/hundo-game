import React from 'react';
import hundoLogoFigure from '../../assets/hundo_logo_figure_only.png';
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
                    <img src={hundoLogoFigure} alt="Hundo" className="card-pattern" />
                    <div className="card-number">{number}</div>
                    {playerName && <div className="card-player">{playerName}</div>}
                </div>
                <div className="card-back">
                    <img src={hundoLogoFigure} alt="Hundo" className="card-pattern" />
                </div>
            </div>
        </div>
    );
}
