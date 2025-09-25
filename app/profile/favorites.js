import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function Favorites() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Favoris' }} />
      <Text>Écran : Favoris</Text>
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
