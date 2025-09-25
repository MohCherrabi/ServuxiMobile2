import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AuthOptionsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { userType } = useLocalSearchParams();
  const [signupPressed, setSignupPressed] = useState(false);
  const [signinPressed, setSigninPressed] = useState(false);

  return (
    <View style={styles.container}>
      {/* LE HEADER EST MAINTENANT GÉRÉ PAR _layout.js */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{t('authTitle')}</Text>
        <Text style={styles.subtitle}>{t('authSubtitle')}</Text>

         <View style={styles.buttonContainer}>
           <TouchableOpacity 
             style={[styles.button, signupPressed && styles.buttonPressed]} 
             onPress={() => router.push({ pathname: './register-form', params: { userType: userType } })}
             onPressIn={() => setSignupPressed(true)}
             onPressOut={() => setSignupPressed(false)}
             activeOpacity={0.8}
           >
             <Text style={[styles.buttonText, signupPressed && styles.buttonTextPressed]}>
               {t('signUp')}
             </Text>
           </TouchableOpacity>
           <TouchableOpacity 
             style={[styles.button, signinPressed && styles.buttonPressed]} 
             onPress={() => router.push('./login')}
             onPressIn={() => setSigninPressed(true)}
             onPressOut={() => setSigninPressed(false)}
             activeOpacity={0.8}
           >
             <Text style={[styles.buttonText, signinPressed && styles.buttonTextPressed]}>
               {t('signIn')}
             </Text>
           </TouchableOpacity>
         </View>

        <Link href="/(tabs)/home" style={styles.visitorLink}>
          {t('continueAsVisitor')}
        </Link>
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
    paddingBottom: 50,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8, marginBottom: 40 },
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
  visitorLink: {
    marginTop: 25,
    color: '#888',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
