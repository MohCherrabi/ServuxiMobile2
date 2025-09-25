# 🔧 Exemples d'Intégration du Système de Rôles et Permissions

## 📱 Migration des Composants Existants

### 1. Mise à Jour du Formulaire d'Inscription

**Avant** (`register-form.js`):
```javascript
// Ligne 313 - Conditions basiques
{userType === 'provider' ? renderProviderForm() : renderClientForm()}
```

**Après** (avec le nouveau système):
```javascript
import { PermissionGate } from '../../src/components/PermissionGate';
import { usePermissions } from '../../src/hooks/usePermissions';

export default function RegisterFormScreen() {
  const { isProvider, isClient } = usePermissions();
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Formulaire Client */}
        <PermissionGate roles={['client']}>
          {renderClientForm()}
        </PermissionGate>

        {/* Formulaire Prestataire avec champs avancés */}
        <PermissionGate roles={['provider']}>
          {renderProviderForm()}
        </PermissionGate>

        {/* Champs d'administration - uniquement pour les admins */}
        <PermissionGate minimumRole="admin">
          <View style={styles.adminSection}>
            <Text style={styles.sectionTitle}>Options d'administration</Text>
            <Switch 
              label="Compte pré-vérifié" 
              onValueChange={setPreVerified}
            />
            <Picker
              selectedValue={manualRole}
              onValueChange={setManualRole}
            >
              <Picker.Item label="Client" value="client" />
              <Picker.Item label="Prestataire" value="provider" />
              <Picker.Item label="Modérateur" value="moderator" />
            </Picker>
          </View>
        </PermissionGate>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>
            {isProvider() ? 'Créer mon compte prestataire' : 'Créer mon compte'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
```

### 2. Navigation Conditionnelle

**Mise à jour de `_layout.js`**:
```javascript
import { usePermissions } from '../../src/hooks/usePermissions';
import { PermissionGate } from '../../src/components/PermissionGate';

function TabLayout() {
  const { shouldShowAdminMenu, shouldShowProviderMenu } = usePermissions();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Accueil' }} />
      
      <Tabs.Screen name="search" options={{ title: 'Recherche' }} />
      
      <PermissionGate minimumRole="provider">
        <Tabs.Screen 
          name="provider-dashboard" 
          options={{ title: 'Mes Services' }} 
        />
      </PermissionGate>

      <Tabs.Screen name="messages" options={{ title: 'Messages' }} />
      
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
      
      {shouldShowAdminMenu() && (
        <Tabs.Screen 
          name="admin" 
          options={{ 
            title: 'Administration',
            tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} />
          }} 
        />
      )}
    </Tabs>
  );
}
```

### 3. Composant de Profil Enrichi

**Nouveau composant `profile/enhanced-profile.js`**:
```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { usePermissions } from '../../src/hooks/usePermissions';
import { PermissionGate, AdminGate } from '../../src/components/PermissionGate';
import rolePermissionService from '../../src/api/services/rolePermissionService';

export default function EnhancedProfileScreen() {
  const {
    user,
    userRole,
    isProvider,
    isAdmin,
    canManageUsers,
    canEditProfile
  } = usePermissions();
  
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const profile = await rolePermissionService.getUserProfile();
      setUserStats(profile.stats);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les données');
    }
  };

  const handleRoleChange = async (newRole) => {
    try {
      await rolePermissionService.updateUserRole(user.id, newRole);
      Alert.alert('Succès', 'Rôle mis à jour avec succès');
      // Recharger les permissions
      window.location.reload(); // ou utiliser un rafraîchissement plus propre
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Informations de base */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: user?.avatar }} style={styles.avatar} />
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        
        {/* Badge de rôle */}
        <View style={[styles.roleBadge, styles[userRole]]}>
          <Text style={styles.roleText}>
            {userRole === 'client' && '👤 Client'}
            {userRole === 'provider' && '🔧 Prestataire'}
            {userRole === 'moderator' && '🛡️ Modérateur'}
            {userRole === 'admin' && '⚡ Administrateur'}
            {userRole === 'super_admin' && '👑 Super Admin'}
          </Text>
        </View>
      </View>

      {/* Statistiques pour prestataires */}
      <PermissionGate minimumRole="provider">
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Mes Statistiques</Text>
          <View style={styles.statsGrid}>
            <StatCard title="Services actifs" value={userStats?.activeServices || 0} />
            <StatCard title="Clients servis" value={userStats?.clientsServed || 0} />
            <StatCard title="Note moyenne" value={userStats?.averageRating || 0} />
            <StatCard title="Revenus ce mois" value={`${userStats?.monthlyRevenue || 0} MAD`} />
          </View>
        </View>
      </PermissionGate>

      {/* Actions du profil */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <PermissionGate permissions={['user:profile:edit']}>
          <ActionButton
            title="Modifier mon profil"
            icon="✏️"
            onPress={() => navigation.navigate('EditProfile')}
          />
        </PermissionGate>

        <PermissionGate minimumRole="provider">
          <ActionButton
            title="Gérer mes services"
            icon="🔧"
            onPress={() => navigation.navigate('ManageServices')}
          />
          <ActionButton
            title="Voir mes abonnements"
            icon="💳"
            onPress={() => navigation.navigate('Subscriptions')}
          />
        </PermissionGate>

        <PermissionGate minimumRole="moderator">
          <ActionButton
            title="Outils de modération"
            icon="🛡️"
            onPress={() => navigation.navigate('ModerationTools')}
          />
        </PermissionGate>

        <AdminGate>
          <ActionButton
            title="Administration"
            icon="⚙️"
            onPress={() => navigation.navigate('AdminDashboard')}
          />
        </AdminGate>
      </View>

      {/* Gestion des rôles - Admin uniquement */}
      <AdminGate>
        <View style={styles.adminSection}>
          <Text style={styles.sectionTitle}>Gestion des Rôles</Text>
          <Text style={styles.warning}>
            ⚠️ Attention: Modifier les rôles affecte les permissions utilisateur
          </Text>
          
          <View style={styles.roleManagement}>
            <Text>Rôle actuel: {userRole}</Text>
            <TouchableOpacity 
              style={styles.changeRoleButton}
              onPress={() => {
                Alert.alert(
                  'Changer de rôle',
                  'Sélectionnez un nouveau rôle',
                  Object.values(ROLES).map(role => ({
                    text: role.label,
                    onPress: () => handleRoleChange(role.name)
                  }))
                );
              }}
            >
              <Text style={styles.changeRoleText}>Changer de rôle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AdminGate>

      {/* Journal d'activité - Admin/Moderator */}
      <PermissionGate minimumRole="moderator">
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Activité Récente</Text>
          <ActivityLog userId={user?.id} />
        </View>
      </PermissionGate>
    </ScrollView>
  );
}

// Composants auxiliaires
const StatCard = ({ title, value }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const ActionButton = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Text style={styles.actionIcon}>{icon}</Text>
    <Text style={styles.actionTitle}>{title}</Text>
    <Text style={styles.actionArrow}>›</Text>
  </TouchableOpacity>
);
```

### 4. Système de Messages avec Permissions

**Mise à jour de `messages/[id].js`**:
```javascript
import { usePermissions } from '../../src/hooks/usePermissions';
import { PermissionGate } from '../../src/components/PermissionGate';

export default function MessageDetail() {
  const { canSendMessages, canDeleteMessages, canModerateContent } = usePermissions();
  const [message, setMessage] = useState('');

  return (
    <View style={styles.container}>
      <MessagesList />
      
      {/* Zone de saisie - si autorisé à envoyer */}
      <PermissionGate permissions={['message:send']}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Tapez votre message..."
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={sendMessage}
          >
            <Text>Envoyer</Text>
          </TouchableOpacity>
        </View>
      </PermissionGate>

      {/* Actions de modération */}
      <PermissionGate permissions={['message:moderate', 'message:delete']}>
        <View style={styles.moderationPanel}>
          <Text style={styles.moderationTitle}>Actions de modération</Text>
          
          <PermissionGate permissions={['message:delete']}>
            <TouchableOpacity 
              style={[styles.moderationButton, styles.deleteButton]}
              onPress={deleteMessage}
            >
              <Text>Supprimer le message</Text>
            </TouchableOpacity>
          </PermissionGate>

          <PermissionGate permissions={['content:moderate']}>
            <TouchableOpacity 
              style={[styles.moderationButton, styles.reportButton]}
              onPress={reportUser}
            >
              <Text>Signaler l'utilisateur</Text>
            </TouchableOpacity>
          </PermissionGate>
        </View>
      </PermissionGate>
    </View>
  );
}
```

### 5. Liste de Prestataires avec Actions Conditionnelles

**Nouveau composant `providers/provider-list.js`**:
```javascript
import { usePermissions } from '../../src/hooks/usePermissions';
import { PermissionGate } from '../../src/components/PermissionGate';

export default function ProviderList() {
  const { canManageProviders, canVerifyProviders } = usePermissions();
  const [providers, setProviders] = useState([]);

  const ProviderCard = ({ provider }) => {
    return (
      <View style={styles.providerCard}>
        <View style={styles.providerInfo}>
          <Image source={{ uri: provider.avatar }} style={styles.avatar} />
          <View style={styles.details}>
            <Text style={styles.name}>{provider.name}</Text>
            <Text style={styles.category}>{provider.category}</Text>
            <Text style={styles.location}>{provider.city}</Text>
          </View>
        </View>

        {/* Badge de statut */}
        <View style={[styles.statusBadge, styles[provider.status]]}>
          <Text style={styles.statusText}>
            {provider.verified ? '✅ Vérifié' : '⏳ En attente'}
          </Text>
        </View>

        {/* Actions d'administration */}
        <PermissionGate permissions={['provider:verify', 'provider:suspend']}>
          <View style={styles.adminActions}>
            
            {!provider.verified && (
              <PermissionGate permissions={['provider:verify']}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.verifyButton]}
                  onPress={() => verifyProvider(provider.id)}
                >
                  <Text style={styles.actionText}>Vérifier</Text>
                </TouchableOpacity>
              </PermissionGate>
            )}

            <PermissionGate permissions={['provider:suspend']}>
              <TouchableOpacity
                style={[styles.actionButton, styles.suspendButton]}
                onPress={() => suspendProvider(provider.id)}
              >
                <Text style={styles.actionText}>Suspendre</Text>
              </TouchableOpacity>
            </PermissionGate>

            <PermissionGate minimumRole="admin">
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => editProvider(provider.id)}
              >
                <Text style={styles.actionText}>Modifier</Text>
              </TouchableOpacity>
            </PermissionGate>

          </View>
        </PermissionGate>

        {/* Actions utilisateur standard */}
        <View style={styles.userActions}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => contactProvider(provider.id)}
          >
            <Text>Contacter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => viewProvider(provider.id)}
          >
            <Text>Voir le profil</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Prestataires</Text>
      
      {/* Filtres d'administration */}
      <PermissionGate minimumRole="moderator">
        <View style={styles.adminFilters}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => filterProviders('pending')}
          >
            <Text>En attente de vérification</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => filterProviders('suspended')}
          >
            <Text>Suspendus</Text>
          </TouchableOpacity>
        </View>
      </PermissionGate>

      {providers.map(provider => (
        <ProviderCard key={provider.id} provider={provider} />
      ))}
    </ScrollView>
  );
}
```

## 🔗 Intégration avec l'API Backend

### Exemple d'API Laravel (Structure suggérée)

**Routes (web.php)**:
```php
// Routes protégées par authentication
Route::middleware('auth:sanctum')->group(function () {
    
    // Profile et permissions
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/refresh-permissions', [AuthController::class, 'refreshPermissions']);
    
    // Gestion des utilisateurs
    Route::middleware('permission:user:read')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{user}', [UserController::class, 'show']);
    });
    
    Route::middleware('permission:user:create')->group(function () {
        Route::post('/users', [UserController::class, 'store']);
    });
    
    Route::middleware('permission:user:update')->group(function () {
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::put('/users/{user}/role', [UserController::class, 'updateRole']);
    });
    
    // Vérification des prestataires
    Route::middleware('permission:provider:verify')->group(function () {
        Route::get('/providers/pending', [ProviderController::class, 'pending']);
        Route::post('/providers/{provider}/verify', [ProviderController::class, 'verify']);
        Route::post('/providers/{provider}/reject', [ProviderController::class, 'reject']);
    });
    
    // Administration
    Route::middleware('role:admin')->group(function () {
        Route::get('/analytics/permissions', [AnalyticsController::class, 'permissions']);
        Route::post('/platform/config', [PlatformController::class, 'updateConfig']);
    });
});
```

**Middleware de permissions**:
```php
class CheckPermission
{
    public function handle($request, Closure $next, $permission)
    {
        $user = auth()->user();
        
        if (!$user || !$user->hasPermission($permission)) {
            return response()->json([
                'error' => 'Permission insuffisante',
                'required_permission' => $permission
            ], 403);
        }
        
        return $next($request);
    }
}
```

## 🎯 Points Clés pour l'Implémentation

### 1. **Sécurité Avant Tout**
```javascript
// ❌ Jamais faire ça
if (userRole === 'admin') {
  // Logique côté client seulement
}

// ✅ Toujours valider côté serveur
if (hasPermission('user:delete')) {
  // Appel API qui va re-vérifier la permission
  await api.deleteUser(userId);
}
```

### 2. **Performance**
```javascript
// ✅ Charger les permissions une seule fois
useEffect(() => {
  initializeAuth(); // Charge user + permissions
}, []);

// ✅ Mise en cache des vérifications
const memoizedPermissionCheck = useMemo(
  () => hasPermission('user:manage'),
  [userPermissions]
);
```

### 3. **UX Progressive**
```javascript
// ✅ Affichage conditionnel gracieux
<PermissionGate 
  permissions={['admin:access']}
  fallback={<Text>Contenu non disponible pour votre niveau d'accès</Text>}
>
  <AdminPanel />
</PermissionGate>
```

### 4. **Debugging**
```javascript
// ✅ Outils de debug en développement
if (__DEV__) {
  console.log('Current user permissions:', userPermissions);
  console.log('Checking permission:', permission, hasPermission(permission));
}
```

Cette approche vous permettra de migrer progressivement vers le nouveau système tout en maintenant la compatibilité avec votre code existant.
