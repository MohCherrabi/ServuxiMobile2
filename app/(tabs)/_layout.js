import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { I18nManager } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../src/components/Header';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFC700',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E5EA',
          borderTopWidth: 1,
          height: 50 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: true,
        header: ({ route }) => (
          <Header 
            title={route.name === 'search' ? 'Recherche' : 
                  route.name === 'messages' ? 'Messages' : 
                  route.name === 'profile' ? 'Profil' : null}
            showBackButton={true}
            showNotifications={true}
            variant="tabs"
          />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('home'),
          headerShown: false, // Pas de header partagé pour la page d'accueil
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
             <Tabs.Screen
               name="search"
               options={{
                 title: t('search'),
                 headerShown: false, // Custom header
                 tabBarIcon: ({ color, focused }) => (
                   <Ionicons name={focused ? 'search' : 'search-outline'} color={color} size={24} />
                 ),
               }}
             />
             <Tabs.Screen
               name="messages"
               options={{
                 title: t('messages'),
                 headerShown: false, // Custom header
                 tabBarIcon: ({ color, focused }) => (
                   <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} color={color} size={24} />
                 ),
               }}
             />
             <Tabs.Screen
               name="profile"
               options={{
                 title: t('profile'),
                 headerShown: false, // Custom header
                 tabBarIcon: ({ color, focused }) => (
                   <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24} />
                 ),
               }}
             />
    </Tabs>
  );
}
