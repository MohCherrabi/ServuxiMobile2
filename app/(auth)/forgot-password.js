import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function ForgotPassword() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Mot de passe oublié' }} />
      <Text>Écran : Mot de passe oublié</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
