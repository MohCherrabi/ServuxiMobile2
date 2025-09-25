import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function PaymentWebview() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Paiement' }} />
      <Text>Écran : Paiement WebView</Text>
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
