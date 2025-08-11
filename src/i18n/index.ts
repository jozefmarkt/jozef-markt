import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

// Function to get the preferred language
const getPreferredLanguage = (): string => {
  // Check if user has a saved language preference
  const savedLanguage = localStorage.getItem('preferred-language');
  if (savedLanguage) {
    return savedLanguage;
  }

  // Check browser language
  const browserLanguage = navigator.language || navigator.languages?.[0] || 'en';
  
  // If browser language is Arabic or starts with 'ar', use Arabic
  if (browserLanguage.startsWith('ar')) {
    return 'ar';
  }
  
  // If browser language is Dutch or starts with 'nl', use Dutch
  if (browserLanguage.startsWith('nl')) {
    return 'nl';
  }
  
  // Default to Arabic for new visitors
  return 'ar';
};

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    lng: getPreferredLanguage(), // Use the preferred language function
    fallbackLng: 'ar', // Change fallback to Arabic
    ns: ['common', 'cart', 'admin', 'products', 'contact'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false // This will prevent the app from showing loading states while translations load
    },
    debug: false // Disable debug mode
  });

export default i18n; 