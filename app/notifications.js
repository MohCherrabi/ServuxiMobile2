import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function Notifications() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Notifications' }} />
      <Text>Écran : Notifications</Text>
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
