import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setUserType } = useAuthStore(); // Nouvelle action du store

  const handleRoleSelect = (role) => {
    // 1. Mémoriser le rôle dans notre état global
    setUserType(role);
    // 2. Naviguer vers l'écran de choix d'authentification
    router.push('./auth-options');
  };

  return (
    <View style={styles.container}>
      {/* LE HEADER EST MAINTENANT GÉRÉ PAR _layout.js */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{t('iAm')}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleRoleSelect('client')}>
            <Text style={styles.buttonText}>{t('client')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleRoleSelect('provider')}>
            <Text style={styles.buttonText}>{t('provider')}</Text>
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
    justifyContent: 'center',
    paddingBottom: 50,
  },
  title: {
    fontSize: 22,
    color: '#666',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    backgroundColor: '#EAEAEA',
    paddingVertical: 18,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#444',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
