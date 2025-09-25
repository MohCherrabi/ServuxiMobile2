import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function PaymentPlans() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Plans de paiement' }} />
      <Text>Écran : Plans de paiement</Text>
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
