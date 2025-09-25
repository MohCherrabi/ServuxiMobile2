# Conventions de Nommage - ServuxiApp

## Composants React

### ✅ Bonnes Pratiques
- **PascalCase** pour les noms de composants
- **Noms simples et directs** - éviter les préfixes redondants
- **Un seul rôle par composant**

### Exemples
```
❌ SharedHeader.jsx       →  ✅ Header.jsx
❌ AuthHeader.jsx         →  ✅ Header.jsx (avec variants)
❌ CustomButton.jsx       →  ✅ Button.jsx
❌ UserProfileCard.jsx    →  ✅ ProfileCard.jsx
```

## Structure des Fichiers

### Composants
```
src/
  components/
    Header.jsx           // Header unifié avec variants
    Button.jsx           // Bouton réutilisable
    Card.jsx            // Carte générique
    Modal.jsx           // Modale réutilisable
```

### Écrans/Pages
```
app/
  (tabs)/
    home.js             // Écran d'accueil
    search.js           // Écran de recherche
    messages.js         // Écran de messages
    profile.js          // Écran de profil
```

### Services/Stores
```
src/
  store/
    authStore.js        // Store d'authentification
    userStore.js        // Store utilisateur
  services/
    api.js              // Service API principal
    auth.js             // Service d'authentification
```

## Éviter la Duplication

### ✅ Composant Unifié avec Variants
```jsx
// Header.jsx - Un seul composant avec options
<Header 
  variant="auth"          // Pour les pages d'auth
  variant="tabs"          // Pour les tabs
  variant="default"       // Par défaut
  title="Mon Titre"
  showBackButton={true}
  showNotifications={false}
/>
```

### ❌ Multiples Composants Similaires
```jsx
// À éviter
<AuthHeader />
<TabsHeader />
<DefaultHeader />
```

## Règles Générales

1. **DRY (Don't Repeat Yourself)** - Un seul composant par fonction
2. **KISS (Keep It Simple, Stupid)** - Noms courts et clairs
3. **Consistance** - Même pattern partout
4. **Flexibilité** - Props pour les variations
5. **Lisibilité** - Le nom doit expliquer la fonction

## Exemples de Refactoring

### Avant (Duplication)
```
AuthHeader.jsx
SharedHeader.jsx
TabsHeader.jsx
```

### Après (Unifié)
```
Header.jsx
  - variant: 'auth' | 'tabs' | 'default'
  - title?: string
  - showBackButton?: boolean
  - showNotifications?: boolean
```

Cette approche réduit la duplication de code et simplifie la maintenance ! 🚀
