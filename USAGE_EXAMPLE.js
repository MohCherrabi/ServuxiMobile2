import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
    ClientRoute,
    ProviderRoute
} from './src/components/EnhancedProtectedRoute';
import {
    AuthenticatedGate,
    ClientGate,
    PermissionGate,
    ProviderGate,
    VisitorGate
} from './src/components/PermissionGate';
import { usePermissions } from './src/hooks/usePermissions';
import { PERMISSIONS } from './src/store/rolePermissionStore';

// =============================================
// EXEMPLE D'UTILISATION DU SYSTÈME DE PERMISSIONS
// =============================================

// 1. Page d'accueil avec contenu conditionnel
export function HomePage() {
  const { 
    isVisitor, 
    isClient, 
    isProvider,
    canCreateRequests,
    canCreateServices,
    shouldShowProviderMenu 
  } = usePermissions();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Bienvenue sur ServuxiApp</Text>
      
      {/* Contenu pour visiteurs non connectés */}
      <VisitorGate>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👋 Découvrez nos services</Text>
          <Text>Inscrivez-vous pour accéder à toutes les fonctionnalités !</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </VisitorGate>

      {/* Contenu pour clients */}
      <ClientGate>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 Trouvez le prestataire idéal</Text>
          <Text>Vous êtes connecté en tant que client</Text>
          
          {canCreateRequests() && (
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Publier une demande</Text>
            </TouchableOpacity>
          )}
        </View>
      </ClientGate>

      {/* Contenu pour prestataires */}
      <ProviderGate>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💼 Gérez votre activité</Text>
          <Text>Vous êtes connecté en tant que prestataire</Text>
          
          {canCreateServices() && (
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Ajouter un service</Text>
            </TouchableOpacity>
          )}
        </View>
      </ProviderGate>

      {/* Contenu pour tous les utilisateurs connectés */}
      <AuthenticatedGate>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Fonctionnalités disponibles</Text>
          
          <PermissionGate permissions={[PERMISSIONS.MESSAGE_SEND]}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Messages</Text>
            </TouchableOpacity>
          </PermissionGate>

          <PermissionGate permissions={[PERMISSIONS.PROFILE_EDIT]}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Mon Profil</Text>
            </TouchableOpacity>
          </PermissionGate>
        </View>
      </AuthenticatedGate>
    </ScrollView>
  );
}

// 2. Écran de gestion des services (prestataires uniquement)
export function ServiceManagementScreen() {
  const { canCreateServices, canEditServices, canDeleteServices } = usePermissions();

  return (
    <ProviderRoute>
      <View style={styles.container}>
        <Text style={styles.title}>Mes Services</Text>
        
        {canCreateServices() && (
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>+ Ajouter un service</Text>
          </TouchableOpacity>
        )}

        {/* Liste des services avec actions conditionnelles */}
        <View style={styles.serviceCard}>
          <Text style={styles.serviceName}>Plomberie - Réparation</Text>
          <Text style={styles.servicePrice}>50 MAD/heure</Text>
          
          <View style={styles.serviceActions}>
            <PermissionGate permissions={[PERMISSIONS.SERVICE_EDIT]}>
              <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
                <Text style={styles.actionText}>Modifier</Text>
              </TouchableOpacity>
            </PermissionGate>

            <PermissionGate permissions={[PERMISSIONS.SERVICE_DELETE]}>
              <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
                <Text style={styles.actionText}>Supprimer</Text>
              </TouchableOpacity>
            </PermissionGate>
          </View>
        </View>
      </View>
    </ProviderRoute>
  );
}

// 3. Écran de demandes (clients uniquement)
export function RequestManagementScreen() {
  const { canCreateRequests, canEditRequests } = usePermissions();

  return (
    <ClientRoute>
      <View style={styles.container}>
        <Text style={styles.title}>Mes Demandes</Text>
        
        {canCreateRequests() && (
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>+ Nouvelle demande</Text>
          </TouchableOpacity>
        )}

        {/* Liste des demandes */}
        <View style={styles.serviceCard}>
          <Text style={styles.serviceName}>Recherche plombier - Casablanca</Text>
          <Text style={styles.servicePrice}>Budget: 200-300 MAD</Text>
          
          <PermissionGate permissions={[PERMISSIONS.REQUEST_EDIT]}>
            <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
              <Text style={styles.actionText}>Modifier</Text>
            </TouchableOpacity>
          </PermissionGate>
        </View>
      </View>
    </ClientRoute>
  );
}

// 4. Navigation conditionnelle
export function ConditionalNavigation() {
  const { 
    isVisitor,
    shouldShowProviderMenu, 
    shouldShowClientMenu,
    shouldShowServiceManagement,
    shouldShowRequestManagement 
  } = usePermissions();

  return (
    <View style={styles.navigation}>
      {/* Navigation pour visiteurs */}
      <VisitorGate>
        <TouchableOpacity style={styles.navButton}>
          <Text>🏠 Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text>🔍 Explorer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text>📝 S'inscrire</Text>
        </TouchableOpacity>
      </VisitorGate>

      {/* Navigation pour clients */}
      {shouldShowClientMenu() && (
        <ClientGate>
          <TouchableOpacity style={styles.navButton}>
            <Text>🏠 Accueil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Text>🔍 Recherche</Text>
          </TouchableOpacity>
          {shouldShowRequestManagement() && (
            <TouchableOpacity style={styles.navButton}>
              <Text>📋 Mes Demandes</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.navButton}>
            <Text>💬 Messages</Text>
          </TouchableOpacity>
        </ClientGate>
      )}

      {/* Navigation pour prestataires */}
      {shouldShowProviderMenu() && (
        <ProviderGate>
          <TouchableOpacity style={styles.navButton}>
            <Text>🏠 Accueil</Text>
          </TouchableOpacity>
          {shouldShowServiceManagement() && (
            <TouchableOpacity style={styles.navButton}>
              <Text>🔧 Mes Services</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.navButton}>
            <Text>📊 Abonnements</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Text>💬 Messages</Text>
          </TouchableOpacity>
        </ProviderGate>
      )}

      {/* Navigation commune aux utilisateurs connectés */}
      <AuthenticatedGate>
        <TouchableOpacity style={styles.navButton}>
          <Text>👤 Profil</Text>
        </TouchableOpacity>
      </AuthenticatedGate>
    </View>
  );
}

// 5. Gestion des erreurs de permissions
export function ActionButtonWithPermission({ action, onPress, children }) {
  const { getPermissionError } = usePermissions();

  const handlePress = () => {
    try {
      onPress();
    } catch (error) {
      const errorMessage = getPermissionError(action);
      Alert.alert('Permission refusée', errorMessage);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      {children}
    </TouchableOpacity>
  );
}

// 6. Utilisation avec vérifications multiples
export function ComplexPermissionExample() {
  const { 
    canCreateServices, 
    canManageSubscriptions, 
    isProvider,
    checkMultipleConditions 
  } = usePermissions();

  // Vérifier plusieurs conditions à la fois
  const canAccessProviderDashboard = checkMultipleConditions([
    () => isProvider(),
    () => canCreateServices(),
    () => canManageSubscriptions()
  ]);

  return (
    <View style={styles.container}>
      {canAccessProviderDashboard ? (
        <View>
          <Text>Tableau de bord prestataire complet</Text>
          {/* Contenu avancé pour prestataires */}
        </View>
      ) : (
        <Text>Accès limité ou permissions insuffisantes</Text>
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  button: {
    backgroundColor: '#FFC700',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16
  },
  serviceCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  servicePrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10
  },
  serviceActions: {
    flexDirection: 'row',
    gap: 10
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6
  },
  editButton: {
    backgroundColor: '#4CAF50'
  },
  deleteButton: {
    backgroundColor: '#f44336'
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  navButton: {
    alignItems: 'center',
    padding: 10
  }
});

// =============================================
// GUIDE D'UTILISATION RAPIDE
// =============================================

/*

UTILISATION SIMPLE :

1. Import du hook
import { usePermissions } from './src/hooks/usePermissions';

2. Vérifications de rôles
const { isClient, isProvider, isVisitor } = usePermissions();

3. Vérifications de permissions
const { canCreateServices, canSendMessages } = usePermissions();

4. Protection UI
<ProviderGate>
  <ProviderContent />
</ProviderGate>

5. Protection de routes
<ProviderRoute>
  <ProviderScreen />
</ProviderRoute>

PERMISSIONS DISPONIBLES :
- PROFILE_VIEW, PROFILE_EDIT
- REQUEST_CREATE, REQUEST_EDIT, REQUEST_VIEW, REQUEST_DELETE (Clients)
- SERVICE_CREATE, SERVICE_EDIT, SERVICE_VIEW, SERVICE_DELETE (Prestataires)
- MESSAGE_SEND, MESSAGE_READ, MESSAGE_DELETE
- SUBSCRIPTION_CREATE, SUBSCRIPTION_CANCEL, SUBSCRIPTION_VIEW
- PAYMENT_PROCESS, PAYMENT_VIEW
- SEARCH_PROVIDERS, BROWSE_SERVICES
- REVIEW_CREATE, REVIEW_EDIT, REVIEW_DELETE
- PORTFOLIO_MANAGE (Prestataires)

RÔLES :
- visitor (niveau 0) : Accès lecture seulement
- client (niveau 1) : Demandes de services, avis, messages
- provider (niveau 2) : Tout ce qu'un client peut faire + services, abonnements, portfolio

*/
