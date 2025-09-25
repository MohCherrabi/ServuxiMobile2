import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function Gigs() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Mes services' }} />
      <Text>Écran : Mes services</Text>
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
