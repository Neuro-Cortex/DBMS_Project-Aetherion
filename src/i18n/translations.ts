// src/i18n/translations.ts

type TranslationMap = Record<string, Record<string, string>>;

export const translations: TranslationMap = {
  en: {
    dashboard: 'Dashboard',
    appointments: 'Appointments',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    welcome: 'Welcome',
    bloodGroup: 'Blood Group',
    emergency: 'Emergency',
  },
  bn: {
    dashboard: 'ড্যাশবোর্ড',
    appointments: 'অ্যাপয়েন্টমেন্ট',
    profile: 'প্রোফাইল',
    settings: 'সেটিংস',
    logout: 'লগআউট',
    welcome: 'স্বাগতম',
    bloodGroup: 'রক্তের গ্রুপ',
    emergency: 'জরুরি অবস্থা',
  },
  es: {
    dashboard: 'Panel',
    appointments: 'Citas',
    profile: 'Perfil',
    settings: 'Configuración',
    logout: 'Cerrar sesión',
    welcome: 'Bienvenido',
    bloodGroup: 'Grupo sanguíneo',
    emergency: 'Emergencia',
  }
};

// src/context/LanguageContext.tsx
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'bn' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
};

export const useLanguage = () => useContext(LanguageContext);
