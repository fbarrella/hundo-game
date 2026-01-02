import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './LanguageSelector.css';

export default function LanguageSelector() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="language-selector">
            <div className="language-selector-buttons">
                <button
                    className={`language-button ${language === 'en' ? 'active' : ''}`}
                    onClick={() => setLanguage('en')}
                    aria-label="English"
                    title="English"
                >
                    🇬🇧
                </button>
                <button
                    className={`language-button ${language === 'pt-BR' ? 'active' : ''}`}
                    onClick={() => setLanguage('pt-BR')}
                    aria-label="Português Brasileiro"
                    title="Português Brasileiro"
                >
                    🇧🇷
                </button>
            </div>
        </div>
    );
}
