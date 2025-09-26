import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

import ar from '../locales/ar.json';
import fr from '../locales/fr.json';

const resources = {
  fr: fr,
  ar: ar,
};

const deviceLanguage = getLocales()[0]?.languageCode || 'fr';

// RTL Languages
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

// Function to check if language is RTL
export const isRTL = (language: string) => RTL_LANGUAGES.includes(language);

// Function to set RTL layout
export const setRTLLayout = (language: string) => {
  const shouldBeRTL = isRTL(language);
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
  }
};

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

// Set initial RTL layout
setRTLLayout(deviceLanguage);

// Listen for language changes
i18n.on('languageChanged', (language) => {
  setRTLLayout(language);
});

export default i18n;
