import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import i18n from '../src/config/i18n';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="provider/[id]" options={{ headerShown: true }} />
          <Stack.Screen name="messages/[id]" options={{ headerShown: true }} />
          <Stack.Screen name="notifications" options={{ headerShown: true }} />
          <Stack.Screen name="profile/edit" options={{ headerShown: true }} />
          <Stack.Screen name="profile/settings" options={{ headerShown: true }} />
          <Stack.Screen name="profile/favorites" options={{ headerShown: true }} />
          <Stack.Screen name="profile/subscription" options={{ headerShown: true }} />
          <Stack.Screen name="profile/gigs" options={{ headerShown: true }} />
          <Stack.Screen name="faq" options={{ headerShown: true }} />
          <Stack.Screen name="payment/plans" options={{ headerShown: true }} />
          <Stack.Screen name="payment/webview" options={{ headerShown: true }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </I18nextProvider>
  );
}
