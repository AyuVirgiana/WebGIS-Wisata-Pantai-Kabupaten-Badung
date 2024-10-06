import { useState } from 'react';

const translations = {
  en: {
    about_us: 'About Us',
    get_started: 'Get Started'
  },
  id: {
    about_us: 'Tentang Kami',
    get_started: 'Mulai'
  }
};

const useTranslation = () => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    return translations[language][key] || key;
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return { t, changeLanguage };
};

export default useTranslation;
