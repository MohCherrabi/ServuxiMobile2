import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function Search() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Recherche' }} />
      <Text>Écran : Recherche</Text>
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
