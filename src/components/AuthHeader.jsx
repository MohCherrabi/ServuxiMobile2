import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const logo = require('../../assets/images/servuxiLogo.png');

export default function AuthHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 20) + 15 }]}>
      {/* Colonne de Gauche */}
      <View style={styles.sideContainer}>
        {router.canGoBack() && (
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        )}
      </View>

      {/* Colonne Centrale */}
      <View style={styles.centerContainer}>
        <Image source={logo} style={styles.logo} />
      </View>

      {/* Colonne de Droite (Placeholder pour un centrage parfait) */}
      <View style={styles.sideContainer} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFC700',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 30,
    paddingHorizontal: 15,
    minHeight: 100,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginBottom: -10, // Négatif pour supprimer l'espace blanc
    // Ajouter une ombre subtile pour plus de profondeur
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8, // Pour Android
    // Forcer un arrière-plan étendu
    overflow: 'hidden',
    zIndex: 1, // S'assurer que le header est au-dessus
  },
  sideContainer: {
    width: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    // Ombre pour le bouton
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 50,
    resizeMode: 'contain',
  },
});
