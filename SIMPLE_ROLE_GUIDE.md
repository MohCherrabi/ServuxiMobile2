# 🎯 Guide Simplifié - Système de Rôles et Permissions ServuxiApp

## 📋 Système à 3 Rôles

Votre application utilise un système simple avec **3 types d'utilisateurs** :

### 👤 **Visiteur** (niveau 0)
- Utilisateur **non connecté**
- Accès en **lecture seulement**
- Peut parcourir les services et prestataires

### 🛍️ **Client** (niveau 1) 
- Utilisateur connecté cherchant des **services**
- Peut créer des demandes, contacter des prestataires
- Gestion de profil et avis

### 🔧 **Prestataire** (niveau 2)
- Fournisseur de **services**
- Tout ce qu'un client peut faire **+** gestion des services
- Abonnements, portfolio, traitement des paiements

---

## 🔑 Permissions par Rôle

### **Visiteur** 📖
```javascript
- 🔍 Parcourir les services (BROWSE_SERVICES)
- 🔎 Rechercher des prestataires (SEARCH_PROVIDERS)
```

### **Client** 👨‍💼
```javascript
- 👤 Voir/modifier son profil (PROFILE_VIEW, PROFILE_EDIT)
- 📝 Créer/gérer des demandes (REQUEST_CREATE, REQUEST_EDIT, REQUEST_VIEW, REQUEST_DELETE)
- 💬 Envoyer/lire des messages (MESSAGE_SEND, MESSAGE_READ, MESSAGE_DELETE)
- 🔍 Parcourir et rechercher (BROWSE_SERVICES, SEARCH_PROVIDERS)
- ⭐ Créer/gérer des avis (REVIEW_CREATE, REVIEW_EDIT, REVIEW_DELETE)
- 💳 Voir les paiements (PAYMENT_VIEW)
```

### **Prestataire** 🛠️
```javascript
Toutes les permissions client +
- 🔧 Créer/gérer des services (SERVICE_CREATE, SERVICE_EDIT, SERVICE_DELETE, SERVICE_VIEW)
- 💳 Traiter les paiements (PAYMENT_PROCESS)
- 📱 Gérer les abonnements (SUBSCRIPTION_CREATE, SUBSCRIPTION_CANCEL, SUBSCRIPTION_VIEW)
- 🎨 Gérer le portfolio (PORTFOLIO_MANAGE)
- 📋 Voir les demandes des clients (REQUEST_VIEW)
```

---

## 🚀 Utilisation Pratique

### **1. Hook Principal**
```javascript
import { usePermissions } from './src/hooks/usePermissions';

function MonComposant() {
  const { 
    isVisitor, isClient, isProvider,
    canCreateServices, canCreateRequests,
    shouldShowProviderMenu 
  } = usePermissions();

  return (
    <View>
      {isClient() && <Text>Interface Client</Text>}
      {isProvider() && <Text>Interface Prestataire</Text>}
      {shouldShowProviderMenu() && <ProviderMenu />}
    </View>
  );
}
```

### **2. Protection UI**
```javascript
import { ClientGate, ProviderGate, VisitorGate } from './src/components/PermissionGate';

function Navigation() {
  return (
    <View>
      {/* Contenu pour visiteurs */}
      <VisitorGate>
        <TouchableOpacity><Text>S'inscrire</Text></TouchableOpacity>
      </VisitorGate>

      {/* Contenu pour clients */}
      <ClientGate>
        <TouchableOpacity><Text>Mes Demandes</Text></TouchableOpacity>
      </ClientGate>

      {/* Contenu pour prestataires */}
      <ProviderGate>
        <TouchableOpacity><Text>Mes Services</Text></TouchableOpacity>
      </ProviderGate>
    </View>
  );
}
```

### **3. Protection par Permission**
```javascript
import { PermissionGate } from './src/components/PermissionGate';
import { PERMISSIONS } from './src/store/rolePermissionStore';

function ActionButtons() {
  return (
    <View>
      <PermissionGate permissions={[PERMISSIONS.SERVICE_CREATE]}>
        <TouchableOpacity>
          <Text>Créer un Service</Text>
        </TouchableOpacity>
      </PermissionGate>

      <PermissionGate permissions={[PERMISSIONS.REQUEST_CREATE]}>
        <TouchableOpacity>
          <Text>Créer une Demande</Text>
        </TouchableOpacity>
      </PermissionGate>
    </View>
  );
}
```

### **4. Protection de Routes**
```javascript
import { ClientRoute, ProviderRoute } from './src/components/EnhancedProtectedRoute';

// Route réservée aux clients
function RequestScreen() {
  return (
    <ClientRoute>
      <Text>Gestion des demandes</Text>
    </ClientRoute>
  );
}

// Route réservée aux prestataires
function ServiceScreen() {
  return (
    <ProviderRoute>
      <Text>Gestion des services</Text>
    </ProviderRoute>
  );
}
```

---

## 📱 Exemples d'Interface

### **Navigation Adaptive**
```javascript
function AppNavigation() {
  const { isVisitor, isClient, isProvider } = usePermissions();

  return (
    <TabNavigator>
      <Tab name="home" title="Accueil" />
      
      {isVisitor() && (
        <Tab name="register" title="S'inscrire" />
      )}
      
      {isClient() && (
        <Tab name="requests" title="Mes Demandes" />
      )}
      
      {isProvider() && (
        <Tab name="services" title="Mes Services" />
      )}
      
      {(isClient() || isProvider()) && (
        <Tab name="messages" title="Messages" />
      )}
    </TabNavigator>
  );
}
```

### **Boutons d'Action Conditionnels**
```javascript
function ServiceCard({ service }) {
  const { canEditServices, canCreateRequests, isProvider, isClient } = usePermissions();

  return (
    <View style={styles.card}>
      <Text>{service.title}</Text>
      <Text>{service.price} MAD</Text>
      
      {/* Prestataire peut modifier ses services */}
      {isProvider() && canEditServices() && (
        <TouchableOpacity style={styles.editButton}>
          <Text>Modifier</Text>
        </TouchableOpacity>
      )}
      
      {/* Client peut contacter pour ce service */}
      {isClient() && (
        <TouchableOpacity style={styles.contactButton}>
          <Text>Contacter</Text>
        </TouchableOpacity>
      )}
      
      {/* Visiteur voit un bouton d'inscription */}
      <VisitorGate>
        <TouchableOpacity style={styles.registerButton}>
          <Text>S'inscrire pour contacter</Text>
        </TouchableOpacity>
      </VisitorGate>
    </View>
  );
}
```

---

## 🔧 Migration depuis votre Code Actuel

### **Remplacement Simple**
```javascript
// ❌ Ancien code
{userType === 'client' && <ClientMenu />}
{userType === 'provider' && <ProviderMenu />}

// ✅ Nouveau code
<ClientGate><ClientMenu /></ClientGate>
<ProviderGate><ProviderMenu /></ProviderGate>

// OU avec le hook
const { isClient, isProvider } = usePermissions();
{isClient() && <ClientMenu />}
{isProvider() && <ProviderMenu />}
```

### **Protection de Routes**
```javascript
// ❌ Ancien
function ProviderScreen() {
  const { userType } = useAuthStore();
  if (userType !== 'provider') {
    return <Redirect href="/login" />;
  }
  return <ProviderContent />;
}

// ✅ Nouveau
function ProviderScreen() {
  return (
    <ProviderRoute>
      <ProviderContent />
    </ProviderRoute>
  );
}
```

---

## 📊 Matrice des Permissions

| Action | Visiteur | Client | Prestataire |
|--------|----------|--------|-------------|
| Parcourir services | ✅ | ✅ | ✅ |
| Créer un compte | ✅ | ❌ | ❌ |
| Modifier profil | ❌ | ✅ | ✅ |
| Créer demande | ❌ | ✅ | ❌ |
| Créer service | ❌ | ❌ | ✅ |
| Envoyer messages | ❌ | ✅ | ✅ |
| Traiter paiements | ❌ | ❌ | ✅ |
| Gérer abonnements | ❌ | ❌ | ✅ |
| Laisser avis | ❌ | ✅ | ✅ |

---

## 🔒 Sécurité

### **Double Vérification**
```javascript
// ✅ Bon - Vérification client + serveur
const handleCreateService = async () => {
  if (canCreateServices()) {
    try {
      // L'API vérifiera aussi la permission côté serveur
      await api.createService(serviceData);
    } catch (error) {
      if (error.status === 403) {
        Alert.alert('Erreur', 'Permission insuffisante');
      }
    }
  }
};
```

### **Gestion des Erreurs**
```javascript
const { getPermissionError } = usePermissions();

const showPermissionError = (action) => {
  const message = getPermissionError(action);
  Alert.alert('Accès refusé', message);
};
```

---

## 🎯 Points Clés

### ✅ **Avantages du Système**
- **Simple** : Seulement 3 rôles faciles à comprendre
- **Flexible** : Permissions granulaires pour chaque fonctionnalité
- **Sécurisé** : Vérification double (client + serveur)
- **Évolutif** : Facile d'ajouter de nouvelles permissions

### 🚨 **Points d'Attention**
1. **Toujours vérifier côté serveur** - La sécurité ne doit jamais reposer uniquement sur le frontend
2. **Gérer les visiteurs** - Penser à l'expérience des utilisateurs non connectés
3. **Messages d'erreur clairs** - Expliquer pourquoi l'accès est refusé
4. **Test sur tous les rôles** - Vérifier l'interface pour chaque type d'utilisateur

---

## 📚 Fichiers Créés

- `src/store/rolePermissionStore.js` - Store principal avec rôles et permissions
- `src/components/PermissionGate.jsx` - Composants de protection UI
- `src/components/EnhancedProtectedRoute.jsx` - Protection des routes
- `src/hooks/usePermissions.js` - Hook personnalisé simplifié
- `USAGE_EXAMPLE.js` - Exemples concrets d'utilisation

**Le système est prêt à être utilisé dans votre app ServuxiApp ! 🚀**
