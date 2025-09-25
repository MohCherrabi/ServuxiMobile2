import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function EditProfile() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Modifier le profil' }} />
      <Text>Écran : Modifier le profil</Text>
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
