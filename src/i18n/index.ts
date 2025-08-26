import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    lng: 'ar', // default language
    fallbackLng: 'ar',
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