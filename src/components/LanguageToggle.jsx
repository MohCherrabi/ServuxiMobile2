import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { setRTLLayout } from '../config/i18n';

const LanguageToggle = ({ style }) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'fr' ? 'ar' : 'fr';
    i18n.changeLanguage(newLanguage);
    setRTLLayout(newLanguage);
  };

  return (
    <TouchableOpacity style={[styles.languageButton, style]} onPress={toggleLanguage}>
      <Text style={styles.languageText}>
        {i18n.language === 'fr' ? 'AR' : 'FR'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  languageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 12,
  },
  languageText: {
    color: '#333',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default LanguageToggle;
