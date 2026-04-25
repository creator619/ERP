import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  // Inicializálás a localStorage-ból, vagy alapértelmezetten "HU"
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('erp_language');
    return saved || 'HU';
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('erp_language', lang);
  };

  // Kiegészítő useEffect, hogy a frissített lapon is mentődjön
  useEffect(() => {
    localStorage.setItem('erp_language', language);
  }, [language]);

  const t = (key) => {
    // Alapértelmezetten a betöltött fordítót használjuk, ha nincs kulcs, a kulcs nevét adja vissza.
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
