import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function Profile() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Profil' }} />
      <Text>Écran : Profil</Text>
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
