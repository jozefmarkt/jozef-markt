import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

// Get saved language from localStorage - only use user's explicit choice
const getInitialLanguage = (): string | undefined => {
  // Check if there's a saved language preference
  const savedLang = localStorage.getItem('i18nextLng');
  
  // Only return saved language if it was explicitly set by user
  // (not if it was set automatically by i18next)
  const userExplicitChoice = localStorage.getItem('userLanguageChoice');
  
  if (savedLang && ['en', 'nl', 'ar'].includes(savedLang) && userExplicitChoice === 'true') {
    return savedLang;
  }
  
  // Return undefined if no explicit user choice exists
  return undefined;
};

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    lng: getInitialLanguage() || 'ar', // Use user's choice or default to Arabic
    fallbackLng: 'ar', // Fallback to Arabic
    ns: ['common', 'cart', 'admin', 'products', 'contact', 'help'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: true // Enable suspense to properly handle loading states
    },
    debug: false // Disable debug mode for production
  });

// Save language changes to localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
  // Update document direction for RTL languages
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

// Function to be called when user explicitly changes language
export const setUserLanguageChoice = (language: string) => {
  localStorage.setItem('userLanguageChoice', 'true');
  i18n.changeLanguage(language);
};

// Set initial direction and language (default to Arabic if no user choice)
const initialLang = getInitialLanguage() || 'ar';
document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = initialLang;

export default i18n; 