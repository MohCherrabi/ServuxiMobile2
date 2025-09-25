import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from '../locales/ar.json';
import fr from '../locales/fr.json';

const resources = {
  fr: fr,
  ar: ar,
};

const deviceLanguage = getLocales()[0]?.languageCode || 'fr';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLanguage, // Detect device language
    fallbackLng: 'fr', // Default language if detection fails
    compatibilityJSON: 'v4', // For React Native
    interpolation: {
      escapeValue: false, // React already handles XSS escaping
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
