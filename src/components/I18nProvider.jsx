"use client";

import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import initI18next from "../lib/i18n";
import { safeGetItem } from "../utils/storage";

const I18nProvider = ({ children }) => {
  const [i18nInstance, setI18nInstance] = useState(null);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    // Load language from storage on mount (client-side only)
    const savedLanguage = safeGetItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const onStorage = () => {
      const lang = safeGetItem("language") || "en";
      setLanguage(lang);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    }
  }, []);

  useEffect(() => {
    const initI18n = async () => {
      const instance = await initI18next(language);
      setI18nInstance(instance);
    };
    initI18n();
  }, [language]);

  if (!i18nInstance) {
    return null;
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};

export default I18nProvider;
