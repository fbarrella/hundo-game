import React from 'react';
import { THEMES } from '../../config/themes';
import './ThemeDisplay.css';

/**
 * ThemeDisplay component - shows the current theme scale
 * @param {number} themeCard - The theme card number
 * @param {number} themeInterval - Theme interval index (0-19)
 */
export default function ThemeDisplay({ themeCard, themeInterval }) {
    if (themeInterval === null || themeInterval === undefined) {
        return null;
    }

    const theme = THEMES[themeInterval];

    return (
        <div className="theme-display">
            <div className="theme-header">
                <h2>Round Theme</h2>
                <div className="theme-card-number">Card #{themeCard}</div>
            </div>
            <div className="theme-scale">
                <div className="scale-marker low">Lowest</div>
                <div className="scale-text">{theme.scale}</div>
                <div className="scale-marker high">Highest</div>
            </div>
            <div className="theme-range">
                Cards {theme.range[0]} - {theme.range[1]}
            </div>
        </div>
    );
}
