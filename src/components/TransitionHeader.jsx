import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const logo = require('../../assets/images/servuxiLogo.png');

// Composant d'icône de retour avec fallback
const BackIcon = ({ size = 24, color = "#FFFFFF" }) => {
  try {
    return <Ionicons name="arrow-back" size={size} color={color} />;
  } catch (error) {
    // Fallback si Ionicons ne fonctionne pas
    return (
      <Text style={{ 
        fontSize: size - 2, 
        color, 
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: size 
      }}>
        ←
      </Text>
    );
  }
};

export default function TransitionHeader({ showBackButton = true, startTransition = false }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Utiliser un état React normal pour la logique conditionnelle
  const isSmallHeader = startTransition;
  
  // Valeurs animées
  const transitionProgress = useSharedValue(startTransition ? 1 : 0);
  const backButtonOpacity = useSharedValue(showBackButton ? 1 : 0);

  useEffect(() => {
    if (startTransition) {
      // Animation d'entrée fluide
      transitionProgress.value = withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
    }
    
    if (showBackButton) {
      backButtonOpacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.quad),
      });
    }
  }, [startTransition, showBackButton]);

  // Style animé pour le conteneur principal
  const animatedContainerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      transitionProgress.value,
      [0, 1],
      [300, 100] // De grand header vers petit header
    );
    
    const paddingBottom = interpolate(
      transitionProgress.value,
      [0, 1],
      [40, 30]
    );

    return {
      height,
      paddingBottom,
    };
  });

  // Style animé pour le logo
  const animatedLogoStyle = useAnimatedStyle(() => {
    const width = interpolate(
      transitionProgress.value,
      [0, 1],
      [200, 120] // De grand logo vers petit logo
    );
    
    const height = interpolate(
      transitionProgress.value,
      [0, 1],
      [100, 50]
    );

    return {
      width,
      height,
    };
  });

  // Style animé pour le bouton retour
  const animatedBackButtonStyle = useAnimatedStyle(() => {
    const opacity = backButtonOpacity.value;
    const scale = interpolate(
      backButtonOpacity.value,
      [0, 1],
      [0.5, 1]
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[
      styles.headerContainer, 
      { paddingTop: Math.max(insets.top, 20) + 15 },
      animatedContainerStyle,
      isSmallHeader ? styles.headerRow : styles.headerCentered
    ]}>
      {isSmallHeader ? (
        // Layout à 3 colonnes (écrans auth)
        <>
          {/* Colonne de Gauche */}
          <View style={styles.sideContainer}>
            {showBackButton && (
              <Animated.View style={animatedBackButtonStyle}>
                <TouchableOpacity 
                  onPress={() => router.back()} 
                  style={styles.backButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.8}
                >
                  <BackIcon size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>

          {/* Colonne Centrale */}
          <View style={styles.centerContainer}>
            <Animated.Image source={logo} style={[styles.logo, animatedLogoStyle]} />
          </View>

          {/* Colonne de Droite */}
          <View style={styles.sideContainer} />
        </>
      ) : (
        // Layout centré (écran de sélection de langue)
        <Animated.Image source={logo} style={[styles.logo, animatedLogoStyle]} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFC700',
    paddingHorizontal: 15,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginBottom: -10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
    zIndex: 1,
  },
  headerCentered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 4,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#6B7280', // Gris foncé comme dans l'image
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    resizeMode: 'contain',
  },
});
