import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './LanguageSelector.css';

export default function LanguageSelector() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setIsOpen(false);
    };

    return (
        <div className={`lang-selector ${isOpen ? 'open' : ''}`}>
            <button
                className="lang-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle language selector"
            >
                🌐
            </button>

            {isOpen && (
                <div className="lang-options">
                    <button
                        className={`lang-option ${language === 'en' ? 'active' : ''}`}
                        onClick={() => handleLanguageChange('en')}
                        aria-label="English"
                    >
                        🇬🇧
                    </button>
                    <button
                        className={`lang-option ${language === 'pt-BR' ? 'active' : ''}`}
                        onClick={() => handleLanguageChange('pt-BR')}
                        aria-label="Português"
                    >
                        🇧🇷
                    </button>
                </div>
            )}
        </div>
    );
}
