import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const logo = require('../assets/images/servuxiLogo.png');


export default function LanguageSelectionScreen() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  // Height of the header block so header + content are visually centered
  const headerHeight = Math.max(insets.top + 120, Math.floor(screenHeight * 0.45));
  const [arabicPressed, setArabicPressed] = useState(false);
  const [frenchPressed, setFrenchPressed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Animation values
  const splashAnimation = useSharedValue(1); // 1 = splash visible, 0 = content visible
  const headerAnimation = useSharedValue(0);
  const contentAnimation = useSharedValue(0);

  useEffect(() => {
    // Après 2.5 secondes, commencer la transition
    const timer = setTimeout(() => {
      // 1. Logo remonte vers le header et fond change
      splashAnimation.value = withTiming(0, {
        duration: 1200,
        easing: Easing.out(Easing.cubic),
      });
      
      // 2. Header background et autres éléments apparaissent
      headerAnimation.value = withDelay(400, withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      }));
      
      // 3. Contenu apparaît après que le logo soit en place
      contentAnimation.value = withDelay(800, withTiming(1, {
        duration: 1000,
        easing: Easing.out(Easing.cubic),
      }));
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    // Décalage nécessaire pour passer du centre d'écran au centre du header
    const deltaToHeaderCenter = (screenHeight - headerHeight) / 2;
    const translateY = interpolate(
      splashAnimation.value,
      [1, 0],
      [0, -deltaToHeaderCenter]
    );

    const scale = interpolate(
      splashAnimation.value,
      [1, 0],
      [1.2, 0.7]
    );

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: splashAnimation.value > 0.5 ? '#FFC700' : '#fff',
    };
  });

  const headerElementsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerAnimation.value,
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentAnimation.value,
      transform: [{ translateY: (1 - contentAnimation.value) * 50 }],
    };
  });

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
    <Animated.View style={[styles.container, backgroundAnimatedStyle]}>
      <StatusBar barStyle="light-content" backgroundColor="#FFC700" />
      
      {/* Header background - apparaît progressivement */}
      <Animated.View style={[
        styles.headerBackground, 
        headerElementsAnimatedStyle,
        { height: headerHeight, paddingTop: insets.top }
      ]} />
      
      {/* Logo animé - du centre vers position header */}
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <Image source={logo} style={styles.logo} />
      </Animated.View>

      {/* Contenu animé - apparaît à la fin */}
      <Animated.View style={[
        styles.contentContainer, 
        contentAnimatedStyle,
        { paddingTop: headerHeight + 24 }
      ]}>
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
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC700', // Fond animé jaune → blanc
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120, // Sera overridé dynamiquement
    backgroundColor: '#FFC700',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  logoContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    marginTop: -50, // Centré initialement
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
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
    marginTop: 50,
    width: '100%',
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
