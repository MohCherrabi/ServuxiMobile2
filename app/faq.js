import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function FAQ() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'FAQ' }} />
      <Text>Écran : FAQ</Text>
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
