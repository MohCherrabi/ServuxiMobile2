import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [buttonPressed, setButtonPressed] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('error'), t('fillAllFields'));
      return;
    }
    try {
      await login(email, password);
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert(t('loginFailed'), t('checkCredentials'));
    }
  };

  return (
    <View style={styles.container}>
      {/* LE HEADER A DISPARU D'ICI, GÉRÉ PAR _layout.js */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>{t('signIn')}</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder={t('email')} 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address" 
          autoCapitalize="none" 
        />
        <TextInput 
          style={styles.input} 
          placeholder={t('password')} 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
        />

      <TouchableOpacity 
        style={[styles.button, buttonPressed && styles.buttonPressed]} 
        onPress={handleLogin}
        onPressIn={() => setButtonPressed(true)}
        onPressOut={() => setButtonPressed(false)}
        activeOpacity={0.8}
      >
        <Text style={[styles.buttonText, buttonPressed && styles.buttonTextPressed]}>
          {t('signIn')}
        </Text>
      </TouchableOpacity>

        <View style={styles.linksContainer}>
          <Link href="./forgot-password" style={styles.link}>{t('forgotPassword')}</Link>
          <Link href="./register" style={styles.link}>{t('createAccount')}</Link>
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
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#EAEAEA',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonTextPressed: {
    color: '#333',
    fontWeight: '800',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  link: {
    color: '#007AFF',
    fontSize: 16,
    marginVertical: 5,
  },
});