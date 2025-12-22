"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { safeGetItem, safeSetItem } from "../utils/storage";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const { i18n } = useTranslation();

  useEffect(() => {
    // Get language from localStorage or default to 'en'
    const savedLanguage = safeGetItem("language") || "en";
    setCurrentLanguage(savedLanguage);
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const changeLanguage = (locale) => {
    setCurrentLanguage(locale);
    safeSetItem("language", locale);
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(locale);
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
