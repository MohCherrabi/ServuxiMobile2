# Store d'Authentification - Documentation

## Structure

```
src/store/
├── authStore.js          # Store d'authentification de base
├── authStore.enhanced.js # Version avancée avec persist et gestion d'erreurs
├── index.js             # Exports centralisés
└── README.md            # Cette documentation
```

## Usage de base

### 1. Dans un composant

```javascript
import { useAuthStore } from '@/src/store/authStore';

export default function LoginScreen() {
  const { login, isLoading, isAuthenticated } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password');
      // Redirection après connexion réussie
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  return (
    // Votre UI de connexion
  );
}
```

### 2. Avec le hook personnalisé

```javascript
import { useAuth } from '@/src/hooks/useAuth';

export default function ProfileScreen() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <View>
      <Text>Bonjour {user?.name}</Text>
      <Button title="Déconnexion" onPress={logout} />
    </View>
  );
}
```

## État du store

```javascript
{
  user: null | Object,          // Données utilisateur
  token: null | string,         // Token d'authentification
  isAuthenticated: boolean,     // État de connexion
  isLoading: boolean,          // État de chargement
  error: null | string         // Erreur (version enhanced)
}
```

## Actions disponibles

### authStore.js (version de base)
- `initializeAuth()` - Initialise l'auth au démarrage
- `login(email, password)` - Connexion
- `logout()` - Déconnexion

### authStore.enhanced.js (version avancée)
- `initializeAuth()` - Initialise avec validation du token
- `login(email, password)` - Connexion avec gestion d'erreurs
- `register(userData)` - Inscription
- `logout()` - Déconnexion avec notification serveur
- `updateProfile(userData)` - Mise à jour du profil
- `clearError()` - Effacer les erreurs

## Composants utilitaires

### AuthProvider
Wrap votre app pour initialiser l'authentification :

```javascript
import AuthProvider from '@/src/components/AuthProvider';

export default function App() {
  return (
    <AuthProvider>
      <YourAppContent />
    </AuthProvider>
  );
}
```

### ProtectedRoute
Protège les routes qui nécessitent une authentification :

```javascript
import ProtectedRoute from '@/src/components/ProtectedRoute';

export default function ProtectedScreen() {
  return (
    <ProtectedRoute redirectTo="/login">
      <YourProtectedContent />
    </ProtectedRoute>
  );
}
```

## Intégration avec le layout

Dans `app/_layout.tsx` :

```javascript
import AuthProvider from '@/src/components/AuthProvider';

export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}
```

## Stockage sécurisé

- Le token est automatiquement stocké dans ExpoSecureStore
- La persistance des données est gérée automatiquement
- Les données sensibles sont chiffrées

## Gestion des erreurs

La version enhanced inclut :
- Validation automatique du token au démarrage
- Gestion des erreurs réseau
- Messages d'erreur localisés
- Nettoyage automatique en cas de token invalide
