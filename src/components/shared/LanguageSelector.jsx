import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './LanguageSelector.css';

export default function LanguageSelector() {
    const { language, setLanguage } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        // Auto-collapse after selection on mobile
        setTimeout(() => setIsExpanded(false), 300);
    };

    return (
        <div className={`language-selector ${isExpanded ? 'expanded' : ''}`}>
            <button
                className="language-selector-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label="Toggle language selector"
                aria-expanded={isExpanded}
            >
                <span className="toggle-icon">🌐</span>
            </button>
            <div className="language-selector-buttons">
                <button
                    className={`language-button ${language === 'en' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('en')}
                    aria-label="English"
                    title="English"
                >
                    🇬🇧
                </button>
                <button
                    className={`language-button ${language === 'pt-BR' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('pt-BR')}
                    aria-label="Português Brasileiro"
                    title="Português Brasileiro"
                >
                    🇧🇷
                </button>
            </div>
        </div>
    );
}
