# API Client Documentation

## Structure

```
src/api/
├── client.js          # Client Axios principal
├── config.js          # Configuration API
├── interceptors.js    # Intercepteurs personnalisés
├── index.js          # Exports centralisés
├── services/         # Services API
│   └── authService.js # Service d'authentification
└── README.md         # Cette documentation
```

## Usage

### 1. Client API de base

```javascript
import apiClient from '@/src/api/client';

// Utilisation directe
const response = await apiClient.get('/users');
const userData = await apiClient.post('/users', { name: 'John' });
```

### 2. Services

```javascript
import authService from '@/src/api/services/authService';

// Connexion
const result = await authService.login({
  email: 'user@example.com',
  password: 'password'
});

// Inscription
const user = await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password'
});
```

### 3. Configuration

Modifiez `src/api/config.js` pour:
- Changer l'URL de base de l'API
- Ajouter de nouveaux endpoints
- Configurer les timeouts et retry

## Authentification

Le token d'authentification est automatiquement:
- Ajouté à chaque requête via l'intercepteur
- Stocké de manière sécurisée avec SecureStore
- Supprimé automatiquement en cas d'erreur 401

## Gestion d'erreurs

Les erreurs sont automatiquement gérées par:
- L'intercepteur de réponse dans `client.js`
- La méthode `handleError` dans chaque service
- Redirection automatique en cas de token expiré

## TODO

1. Remplacer l'URL de l'API dans `config.js`
2. Implémenter la navigation vers la page de connexion
3. Ajouter d'autres services selon les besoins
4. Configurer le retry automatique pour les requêtes échouées
