# 🔐 Guide de Gestion des Rôles et Permissions - ServuxiApp

## 📋 Table des Matières
1. [Architecture du Système](#architecture-du-système)
2. [Rôles et Hiérarchie](#rôles-et-hiérarchie)
3. [Permissions Disponibles](#permissions-disponibles)
4. [Implémentation Frontend](#implémentation-frontend)
5. [Intégration Backend](#intégration-backend)
6. [Exemples Pratiques](#exemples-pratiques)
7. [Sécurité](#sécurité)
8. [Migration](#migration)

---

## 🏗️ Architecture du Système

### Vue d'ensemble
Le système de rôles et permissions de ServuxiApp utilise un modèle **RBAC (Role-Based Access Control)** hiérarchique avec:

- **Rôles hiérarchiques** avec niveaux d'autorisation
- **Permissions granulaires** par fonctionnalité
- **Contrôle d'accès au niveau des composants**
- **Protection des routes** basée sur les permissions
- **Vérification côté serveur** pour la sécurité

### Composants Principaux

```
src/
├── store/
│   └── rolePermissionStore.js     # Store Zustand principal
├── components/
│   ├── PermissionGate.jsx         # Contrôle d'accès UI
│   └── EnhancedProtectedRoute.jsx # Protection des routes
├── hooks/
│   └── usePermissions.js          # Hook personnalisé
└── api/
    └── services/
        └── authService.js         # Intégration API
```

---

## 👥 Rôles et Hiérarchie

### Hiérarchie des Rôles (niveau croissant)

| Rôle | Niveau | Description | Permissions héritées |
|------|--------|-------------|---------------------|
| **Client** | 1 | Utilisateur standard cherchant des services | - |
| **Provider** | 2 | Prestataire de services | Client + permissions métier |
| **Moderator** | 3 | Modérateur de contenu | Provider + modération |
| **Admin** | 4 | Administrateur plateforme | Moderator + gestion utilisateurs |
| **Super Admin** | 5 | Administration système | Toutes les permissions |

### Principe d'Héritage
```javascript
// Un admin hérite de toutes les permissions des rôles inférieurs
ROLE_PERMISSIONS[ADMIN] = [
  ...ROLE_PERMISSIONS[MODERATOR],  // Hérite des permissions modérateur
  PERMISSIONS.USER_CREATE,         // Plus ses propres permissions
  PERMISSIONS.USER_DELETE,
  // ...
];
```

---

## 🔑 Permissions Disponibles

### Catégories de Permissions

#### 👤 Gestion Utilisateurs
```javascript
USER_READ: 'user:read'              // Lire les profils utilisateurs
USER_CREATE: 'user:create'          // Créer de nouveaux utilisateurs
USER_UPDATE: 'user:update'          // Modifier les utilisateurs
USER_DELETE: 'user:delete'          // Supprimer des utilisateurs
USER_PROFILE_EDIT: 'user:profile:edit' // Modifier son propre profil
```

#### 🏢 Gestion Prestataires
```javascript
PROVIDER_VERIFY: 'provider:verify'     // Vérifier les prestataires
PROVIDER_SUSPEND: 'provider:suspend'   // Suspendre un prestataire
PROVIDER_APPROVE: 'provider:approve'   // Approuver un prestataire
PROVIDER_REJECT: 'provider:reject'     // Rejeter une candidature
```

#### 📝 Gestion Contenu
```javascript
CONTENT_MODERATE: 'content:moderate'   // Modérer le contenu
CONTENT_DELETE: 'content:delete'       // Supprimer du contenu
CONTENT_EDIT: 'content:edit'          // Modifier le contenu
CONTENT_PUBLISH: 'content:publish'     // Publier du contenu
```

#### 💬 Messagerie
```javascript
MESSAGE_SEND: 'message:send'           // Envoyer des messages
MESSAGE_READ: 'message:read'           // Lire les messages
MESSAGE_DELETE: 'message:delete'       // Supprimer des messages
MESSAGE_MODERATE: 'message:moderate'   // Modérer les messages
```

#### 💳 Paiements
```javascript
PAYMENT_PROCESS: 'payment:process'     // Traiter les paiements
PAYMENT_REFUND: 'payment:refund'       // Effectuer des remboursements
PAYMENT_VIEW: 'payment:view'           // Voir les paiements
PAYMENT_ADMIN: 'payment:admin'         // Administration des paiements
```

---

## 💻 Implémentation Frontend

### 1. Utilisation du Store Principal

```javascript
import { useRolePermissionStore } from '../store/rolePermissionStore';

function MyComponent() {
  const { 
    user, 
    userRole, 
    hasPermission, 
    hasMinimumRole 
  } = useRolePermissionStore();

  return (
    <View>
      <Text>Rôle: {userRole}</Text>
      {hasPermission('user:create') && (
        <Button title="Créer Utilisateur" />
      )}
    </View>
  );
}
```

### 2. Hook Personnalisé (Recommandé)

```javascript
import { usePermissions } from '../hooks/usePermissions';

function MyComponent() {
  const { 
    canManageUsers,
    canModerateContent,
    isAdmin,
    shouldShowAdminMenu 
  } = usePermissions();

  return (
    <View>
      {shouldShowAdminMenu() && <AdminMenu />}
      {canManageUsers() && <UserManagementButton />}
    </View>
  );
}
```

### 3. Contrôle d'Accès UI avec PermissionGate

```javascript
import { PermissionGate, AdminGate } from '../components/PermissionGate';

function MyComponent() {
  return (
    <View>
      {/* Contrôle par permission */}
      <PermissionGate permissions={['user:create', 'user:update']}>
        <UserManagementPanel />
      </PermissionGate>

      {/* Contrôle par rôle minimum */}
      <PermissionGate minimumRole="moderator">
        <ModerationTools />
      </PermissionGate>

      {/* Gates rapides */}
      <AdminGate>
        <AdminSettings />
      </AdminGate>

      {/* Avec message d'erreur */}
      <PermissionGate 
        permissions={['payment:admin']} 
        showError={true}
        errorMessage="Accès réservé aux administrateurs financiers"
      >
        <PaymentAdminPanel />
      </PermissionGate>
    </View>
  );
}
```

### 4. Protection des Routes

```javascript
import { EnhancedProtectedRoute, AdminRoute } from '../components/EnhancedProtectedRoute';

// Protection simple par rôle
export default function AdminDashboard() {
  return (
    <AdminRoute>
      <DashboardContent />
    </AdminRoute>
  );
}

// Protection avancée avec permissions
export default function UserManagement() {
  return (
    <EnhancedProtectedRoute 
      requiredPermissions={['user:read', 'user:update']}
      redirectTo="/unauthorized"
    >
      <UserManagementContent />
    </EnhancedProtectedRoute>
  );
}
```

### 5. HOC pour Protection de Composants

```javascript
import { withPermissions } from '../components/PermissionGate';

const UserEditForm = ({ user, onSave }) => (
  <Form user={user} onSave={onSave} />
);

// Composant protégé
const ProtectedUserEditForm = withPermissions(UserEditForm, {
  permissions: ['user:update'],
  minimumRole: 'moderator'
});
```

---

## 🔧 Intégration Backend

### 1. Endpoints API Requis

```javascript
// Authentication
POST /auth/login
GET  /auth/me
POST /auth/logout

// User Management  
GET    /users                    // Liste des utilisateurs
POST   /users                    // Créer un utilisateur
PUT    /users/{id}               // Modifier un utilisateur
DELETE /users/{id}               // Supprimer un utilisateur
PUT    /users/{id}/role          // Changer le rôle

// Role & Permission Management
GET    /roles                    // Liste des rôles
GET    /permissions              // Liste des permissions
GET    /users/{id}/permissions   // Permissions d'un utilisateur
```

### 2. Format de Réponse API

```javascript
// Réponse de /auth/me
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "permissions": [
      "user:read",
      "user:create",
      "user:update",
      "provider:verify"
    ],
    "verified": true
  }
}

// Réponse de /auth/login  
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": { /* objet utilisateur */ }
}
```

### 3. Middleware Backend (Laravel exemple)

```php
// Middleware de vérification des permissions
class CheckPermission
{
    public function handle($request, Closure $next, $permission)
    {
        if (!auth()->user()->hasPermission($permission)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        return $next($request);
    }
}

// Utilisation dans les routes
Route::middleware(['auth', 'permission:user:create'])->group(function () {
    Route::post('/users', [UserController::class, 'store']);
});
```

---

## 🎯 Exemples Pratiques

### Exemple 1: Tableau de Bord Conditionnel

```javascript
function Dashboard() {
  const {
    shouldShowUserManagement,
    shouldShowProviderManagement,
    shouldShowContentModeration,
    canViewAnalytics
  } = usePermissions();

  return (
    <ScrollView>
      <WelcomeSection />
      
      {shouldShowUserManagement() && (
        <ManagementCard 
          title="Gestion Utilisateurs"
          onPress={() => navigate('/admin/users')}
        />
      )}
      
      {shouldShowProviderManagement() && (
        <ManagementCard 
          title="Prestataires"
          onPress={() => navigate('/admin/providers')}
        />
      )}
      
      {shouldShowContentModeration() && (
        <ManagementCard 
          title="Modération"
          onPress={() => navigate('/admin/moderation')}
        />
      )}
      
      {canViewAnalytics() && (
        <AnalyticsSection />
      )}
    </ScrollView>
  );
}
```

### Exemple 2: Liste d'Actions Contextuelles

```javascript
function UserListItem({ user }) {
  const { canManageUsers, canDeleteUsers, hasMinimumRole } = usePermissions();

  const actions = [];

  if (canManageUsers()) {
    actions.push({
      label: 'Modifier',
      onPress: () => editUser(user.id)
    });
  }

  if (hasMinimumRole('admin') && user.role !== 'super_admin') {
    actions.push({
      label: 'Changer le rôle',
      onPress: () => changeUserRole(user.id)
    });
  }

  if (canDeleteUsers() && user.id !== currentUser.id) {
    actions.push({
      label: 'Supprimer',
      onPress: () => deleteUser(user.id),
      style: 'destructive'
    });
  }

  return (
    <UserCard user={user} actions={actions} />
  );
}
```

### Exemple 3: Formulaire avec Permissions Granulaires

```javascript
function UserEditForm({ user }) {
  const { hasPermission, hasMinimumRole } = usePermissions();

  return (
    <Form>
      <TextInput placeholder="Nom" defaultValue={user.name} />
      <TextInput placeholder="Email" defaultValue={user.email} />
      
      <PermissionGate permissions={['user:update:role']}>
        <RoleSelector currentRole={user.role} />
      </PermissionGate>
      
      <PermissionGate minimumRole="admin">
        <Switch 
          label="Compte vérifié" 
          value={user.verified}
        />
      </PermissionGate>
      
      <PermissionGate permissions={['user:update:permissions']}>
        <PermissionSelector userPermissions={user.permissions} />
      </PermissionGate>
    </Form>
  );
}
```

---

## 🔒 Sécurité

### ⚠️ Points Critiques

1. **Validation Côté Serveur**: Les permissions doivent TOUJOURS être vérifiées côté serveur
2. **Token JWT**: Inclure les rôles/permissions dans le token avec expiration courte
3. **Rechargement des Permissions**: Rafraîchir les permissions lors de changements de rôle
4. **Audit Trail**: Logger les actions sensibles avec rôle et permissions

### ✅ Bonnes Pratiques

```javascript
// ❌ Mauvais - Contrôle côté client uniquement
function deleteUser(userId) {
  if (userRole === 'admin') {
    // Appel API sans vérification serveur
    api.delete(`/users/${userId}`);
  }
}

// ✅ Bon - Vérification double (client + serveur)
function deleteUser(userId) {
  if (hasPermission('user:delete')) {
    // Le serveur vérifiera aussi la permission
    api.delete(`/users/${userId}`)
      .catch(error => {
        if (error.status === 403) {
          Alert.alert('Erreur', 'Permission insuffisante');
        }
      });
  }
}
```

### 🛡️ Protection Anti-Escalation

```javascript
// Empêcher l'auto-escalation de privilèges
const canChangeRole = (targetRole, currentUserRole) => {
  const currentLevel = ROLES[currentUserRole.toUpperCase()]?.level || 0;
  const targetLevel = ROLES[targetRole.toUpperCase()]?.level || 0;
  
  // Un utilisateur ne peut pas donner un rôle supérieur au sien
  return currentLevel > targetLevel;
};
```

---

## 🔄 Migration

### Étapes de Migration depuis le Système Actuel

#### 1. Mise à Jour du Store

```javascript
// Remplacer l'ancien authStore
import { useAuthStore } from './authStore';           // Ancien
import { useRolePermissionStore } from './rolePermissionStore'; // Nouveau

// Migration graduelle possible
const useAuth = () => {
  // Utiliser le nouveau store mais maintenir la compatibilité
  const newStore = useRolePermissionStore();
  return {
    ...newStore,
    userType: newStore.userRole, // Compatibilité avec l'ancien nom
  };
};
```

#### 2. Conversion des Rôles Existants

```javascript
// Mapping des anciens rôles vers les nouveaux
const ROLE_MIGRATION = {
  'client': 'client',
  'provider': 'provider'
};

// Migration automatique lors de la connexion
const migrateUserRole = (oldRole) => {
  return ROLE_MIGRATION[oldRole] || 'client';
};
```

#### 3. Mise à Jour des Composants

```javascript
// Avant
{userType === 'provider' && <ProviderMenu />}

// Après  
<ProviderGate>
  <ProviderMenu />
</ProviderGate>

// Ou avec le hook
{isProvider() && <ProviderMenu />}
```

#### 4. Adaptation Backend Graduelle

1. **Phase 1**: Ajouter les nouveaux champs de rôles/permissions
2. **Phase 2**: Implémenter les nouveaux endpoints  
3. **Phase 3**: Migrer les données existantes
4. **Phase 4**: Supprimer l'ancien système

---

## 📚 Ressources Complémentaires

### Fichiers Implémentés
- `src/store/rolePermissionStore.js` - Store principal
- `src/components/PermissionGate.jsx` - Contrôle d'accès UI
- `src/components/EnhancedProtectedRoute.jsx` - Protection routes
- `src/hooks/usePermissions.js` - Hook personnalisé
- `app/admin/dashboard.js` - Exemple d'interface admin

### Tests Recommandés

```javascript
// Tests unitaires pour les permissions
describe('Permission System', () => {
  test('Admin should have all permissions', () => {
    const permissions = getPermissionsForRole('admin');
    expect(permissions).toContain('user:create');
    expect(permissions).toContain('user:delete');
  });

  test('Client should not have admin permissions', () => {
    const permissions = getPermissionsForRole('client');
    expect(permissions).not.toContain('user:delete');
  });
});
```

### Monitoring et Analytics

```javascript
// Tracking des actions par rôle
const trackPermissionUsage = (permission, userId, action) => {
  analytics.track('Permission Used', {
    permission,
    userId,
    action,
    userRole: getCurrentUserRole(),
    timestamp: new Date().toISOString()
  });
};
```

---

## 🎉 Conclusion

Ce système de rôles et permissions fournit:

✅ **Sécurité renforcée** avec contrôle granulaire  
✅ **Flexibilité** pour faire évoluer les rôles  
✅ **Facilité d'usage** avec hooks et composants prêts à l'emploi  
✅ **Évolutivité** pour supporter de nouveaux besoins  
✅ **Compatibilité** avec votre architecture existante  

Le système est conçu pour grandir avec votre plateforme et s'adapter aux besoins futurs de ServuxiApp.
