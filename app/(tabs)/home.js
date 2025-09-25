import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Accueil' }} />
      <Text>Écran : Accueil</Text>
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
