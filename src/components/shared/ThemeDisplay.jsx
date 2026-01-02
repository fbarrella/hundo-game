import React from 'react';
import { THEMES } from '../../config/themes';
import { useLanguage } from '../../contexts/LanguageContext';
import './ThemeDisplay.css';

/**
 * ThemeDisplay component - shows the current theme scale
 * @param {number} themeCard - The theme card number
 * @param {number} themeInterval - Theme interval index (0-19)
 */
export default function ThemeDisplay({ themeCard, themeInterval }) {
    const { t } = useLanguage();

    if (themeInterval === null || themeInterval === undefined) {
        return null;
    }

    const theme = THEMES[themeInterval];
    const translatedScale = t(`themes.${themeInterval}`);

    return (
        <div className="theme-display">
            <div className="theme-header">
                <h2>{t('themeDisplay.roundTheme')}</h2>
                <div className="theme-card-number">{t('themeDisplay.cardNumber')} {themeCard}</div>
            </div>
            <div className="theme-scale">
                <div className="scale-marker low">{t('themeDisplay.lowest')}</div>
                <div className="scale-text">{translatedScale}</div>
                <div className="scale-marker high">{t('themeDisplay.highest')}</div>
            </div>
            <div className="theme-range">
                {t('themeDisplay.cards')} {theme.range[0]} - {theme.range[1]}
            </div>
        </div>
    );
}
