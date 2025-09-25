import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../hooks/useTranslation';

interface LanguageSwitcherProps {
  style?: any;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ style }) => {
  const { t, changeLanguage, currentLanguage } = useTranslation();

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
  ];

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{t('language')}</Text>
      <View style={styles.languageButtons}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageButton,
              currentLanguage === lang.code && styles.activeLanguageButton,
            ]}
            onPress={() => changeLanguage(lang.code)}
          >
            <Text
              style={[
                styles.languageText,
                currentLanguage === lang.code && styles.activeLanguageText,
              ]}
            >
              {lang.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  activeLanguageButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  languageText: {
    fontSize: 14,
    color: '#333',
  },
  activeLanguageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LanguageSwitcher;
