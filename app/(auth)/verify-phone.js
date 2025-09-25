import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function VerifyPhone() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Vérification téléphone' }} />
      <Text>Écran : Vérification téléphone</Text>
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
