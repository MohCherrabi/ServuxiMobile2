import { Stack } from 'expo-router';
import { View } from 'react-native';
import TransitionHeader from '../../src/components/TransitionHeader';

export default function AuthLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack
        screenOptions={{
          // Applique notre header personnalisé à tous les écrans de ce layout
          header: () => <TransitionHeader showBackButton={true} startTransition={true} />,
          // Assure-toi que le header est bien visible
          headerShown: true,
          // Force l'arrière-plan blanc
          contentStyle: { backgroundColor: '#fff' },
        }}
      >
        <Stack.Screen name="role-select" />
        <Stack.Screen name="auth-options" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="register-form" />
        <Stack.Screen name="verify-phone" />
        <Stack.Screen name="forgot-password" />
      </Stack>
    </View>
  );
}
