import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TransitionHeader from '../src/components/TransitionHeader';


export default function LanguageSelectionScreen() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [arabicPressed, setArabicPressed] = useState(false);
  const [frenchPressed, setFrenchPressed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleLanguageSelect = (lang) => {
    // 1. Déclencher l'animation de transition
    setIsTransitioning(true);
    
    // 2. Changer la langue de l'application
    i18n.changeLanguage(lang);

    // 3. TODO: Stocker la préférence de langue pour les futures sessions
    // (par exemple, avec AsyncStorage)

    // 4. Délai pour l'animation puis navigation
    setTimeout(() => {
      router.push('/(auth)/register');
    }, 400); // Délai pour voir l'animation
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <TransitionHeader 
        showBackButton={false} 
        startTransition={isTransitioning}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>L'APPLICATION</Text>
        <Text style={styles.subtitle}>QUI VOUS CONNECTE EN UN CLIC !</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, arabicPressed && styles.buttonPressed]} 
            onPress={() => handleLanguageSelect('ar')}
            onPressIn={() => setArabicPressed(true)}
            onPressOut={() => setArabicPressed(false)}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, arabicPressed && styles.buttonTextPressed]}>
              ARABE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, frenchPressed && styles.buttonPressed]} 
            onPress={() => handleLanguageSelect('fr')}
            onPressIn={() => setFrenchPressed(true)}
            onPressOut={() => setFrenchPressed(false)}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, frenchPressed && styles.buttonTextPressed]}>
              FRANÇAIS
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '15%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: '15%',
    width: '80%',
  },
  button: {
    backgroundColor: '#EAEAEA',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonPressed: {
    backgroundColor: '#FFC700',
    transform: [{ scale: 0.98 }],
    shadowColor: '#FFC700',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  buttonText: {
    color: '#444',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextPressed: {
    color: '#333',
    fontWeight: '700',
  },
});
