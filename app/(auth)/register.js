import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [clientPressed, setClientPressed] = useState(false);
  const [providerPressed, setProviderPressed] = useState(false);

  const selectRole = (role) => {
    router.push({
      pathname: '/auth-options',
      params: { userType: role }
    });
  };

  return (
    <View style={styles.container}>
      {/* Le header a été supprimé d'ici, il est maintenant géré par _layout.js */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{t('iAm')}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, clientPressed && styles.buttonPressed]} 
            onPress={() => selectRole('client')}
            onPressIn={() => setClientPressed(true)}
            onPressOut={() => setClientPressed(false)}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, clientPressed && styles.buttonTextPressed]}>
              {t('client')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, providerPressed && styles.buttonPressed]} 
            onPress={() => selectRole('provider')}
            onPressIn={() => setProviderPressed(true)}
            onPressOut={() => setProviderPressed(false)}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, providerPressed && styles.buttonTextPressed]}>
              {t('provider')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 22, color: '#666', marginBottom: 30 },
  buttonContainer: { width: '80%' },
  button: {
    backgroundColor: '#EAEAEA',
    paddingVertical: 18,
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
    fontWeight: '700',
    letterSpacing: 1,
  },
  buttonTextPressed: {
    color: '#333',
    fontWeight: '800',
  },
});
