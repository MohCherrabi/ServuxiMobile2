import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import apiClient from '../api/client';

// Role definitions with hierarchy (higher number = more privileges)
export const ROLES = {
  VISITOR: { name: 'visitor', level: 0, label: 'Visiteur' },
  CLIENT: { name: 'client', level: 1, label: 'Client' },
  PROVIDER: { name: 'provider', level: 2, label: 'Prestataire' }
};

// Permission definitions organized by category
export const PERMISSIONS = {
  // Profile Management
  PROFILE_VIEW: 'profile:view',
  PROFILE_EDIT: 'profile:edit',
  
  // Service Requests (Clients)
  REQUEST_CREATE: 'request:create',
  REQUEST_VIEW: 'request:view',
  REQUEST_EDIT: 'request:edit',
  REQUEST_DELETE: 'request:delete',
  
  // Service Provision (Providers)
  SERVICE_CREATE: 'service:create',
  SERVICE_EDIT: 'service:edit',
  SERVICE_DELETE: 'service:delete',
  SERVICE_VIEW: 'service:view',
  
  // Messaging
  MESSAGE_SEND: 'message:send',
  MESSAGE_READ: 'message:read',
  MESSAGE_DELETE: 'message:delete',
  
  // Subscription Management (Providers)
  SUBSCRIPTION_CREATE: 'subscription:create',
  SUBSCRIPTION_CANCEL: 'subscription:cancel',
  SUBSCRIPTION_VIEW: 'subscription:view',
  
  // Payment Management
  PAYMENT_PROCESS: 'payment:process',
  PAYMENT_VIEW: 'payment:view',
  
  // Search and Browse
  SEARCH_PROVIDERS: 'search:providers',
  BROWSE_SERVICES: 'browse:services',
  
  // Reviews and Ratings
  REVIEW_CREATE: 'review:create',
  REVIEW_EDIT: 'review:edit',
  REVIEW_DELETE: 'review:delete',
  
  // Portfolio Management (Providers)
  PORTFOLIO_MANAGE: 'portfolio:manage'
};

// Role-Permission mapping
export const ROLE_PERMISSIONS = {
  [ROLES.VISITOR.name]: [
    // Visiteurs non connectés - accès lecture seulement
    PERMISSIONS.BROWSE_SERVICES,
    PERMISSIONS.SEARCH_PROVIDERS
  ],
  
  [ROLES.CLIENT.name]: [
    // Clients - gestion profil, demandes de services, messages, avis
    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.PROFILE_EDIT,
    PERMISSIONS.REQUEST_CREATE,
    PERMISSIONS.REQUEST_VIEW,
    PERMISSIONS.REQUEST_EDIT,
    PERMISSIONS.REQUEST_DELETE,
    PERMISSIONS.MESSAGE_SEND,
    PERMISSIONS.MESSAGE_READ,
    PERMISSIONS.MESSAGE_DELETE,
    PERMISSIONS.BROWSE_SERVICES,
    PERMISSIONS.SEARCH_PROVIDERS,
    PERMISSIONS.REVIEW_CREATE,
    PERMISSIONS.REVIEW_EDIT,
    PERMISSIONS.REVIEW_DELETE,
    PERMISSIONS.PAYMENT_VIEW
  ],
  
  [ROLES.PROVIDER.name]: [
    // Prestataires - tout ce qu'un client peut faire + gestion services + abonnements
    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.PROFILE_EDIT,
    PERMISSIONS.SERVICE_CREATE,
    PERMISSIONS.SERVICE_EDIT,
    PERMISSIONS.SERVICE_DELETE,
    PERMISSIONS.SERVICE_VIEW,
    PERMISSIONS.MESSAGE_SEND,
    PERMISSIONS.MESSAGE_READ,
    PERMISSIONS.MESSAGE_DELETE,
    PERMISSIONS.SUBSCRIPTION_CREATE,
    PERMISSIONS.SUBSCRIPTION_CANCEL,
    PERMISSIONS.SUBSCRIPTION_VIEW,
    PERMISSIONS.PAYMENT_PROCESS,
    PERMISSIONS.PAYMENT_VIEW,
    PERMISSIONS.BROWSE_SERVICES,
    PERMISSIONS.SEARCH_PROVIDERS,
    PERMISSIONS.REVIEW_CREATE,
    PERMISSIONS.REVIEW_EDIT,
    PERMISSIONS.REVIEW_DELETE,
    PERMISSIONS.PORTFOLIO_MANAGE,
    // Peut voir les demandes de clients
    PERMISSIONS.REQUEST_VIEW
  ]
};

// Create the enhanced auth store with role and permission management
export const useRolePermissionStore = create((set, get) => ({
  // State
  user: null,
  token: null,
  userRole: null,
  userPermissions: [],
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Helper functions
  hasPermission: (permission) => {
    const { userPermissions } = get();
    return userPermissions.includes(permission);
  },

  hasRole: (role) => {
    const { userRole } = get();
    return userRole === role;
  },

  hasMinimumRole: (requiredRole) => {
    const { userRole } = get();
    if (!userRole) return false;
    
    const currentRoleLevel = ROLES[userRole.toUpperCase()]?.level || 0;
    const requiredRoleLevel = ROLES[requiredRole.toUpperCase()]?.level || 0;
    
    return currentRoleLevel >= requiredRoleLevel;
  },

  hasAnyRole: (roles) => {
    const { userRole } = get();
    return roles.includes(userRole);
  },

  hasAnyPermission: (permissions) => {
    const { userPermissions } = get();
    return permissions.some(permission => userPermissions.includes(permission));
  },

  hasAllPermissions: (permissions) => {
    const { userPermissions } = get();
    return permissions.every(permission => userPermissions.includes(permission));
  },

  // Get user permissions based on role
  getPermissionsForRole: (role) => {
    return ROLE_PERMISSIONS[role] || [];
  },

  // Actions
  initializeAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        try {
          // Fetch user profile and permissions from backend
          const response = await apiClient.get('/auth/me');
          const { user } = response.data;
          
          const userRole = user.role || ROLES.CLIENT.name;
          const userPermissions = get().getPermissionsForRole(userRole);
          
          set({ 
            user, 
            token, 
            userRole,
            userPermissions,
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          // Token invalid, clean up
          await get().logout();
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ 
        error: 'Erreur lors de l\'initialisation', 
        isLoading: false 
      });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      const userRole = user.role || ROLES.CLIENT.name;
      const userPermissions = get().getPermissionsForRole(userRole);
      
      await SecureStore.setItemAsync('userToken', token);
      set({ 
        user, 
        token, 
        userRole,
        userPermissions,
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
      
      return { success: true };
    } catch (error) {
      set({ 
        error: error.message || 'Erreur de connexion', 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  updateUserRole: async (newRole) => {
    const { user } = get();
    if (!user) return { success: false, error: 'Utilisateur non connecté' };

    try {
      const response = await apiClient.put(`/users/${user.id}/role`, { role: newRole });
      const updatedUser = { ...user, role: newRole };
      const userPermissions = get().getPermissionsForRole(newRole);
      
      set({ 
        user: updatedUser, 
        userRole: newRole,
        userPermissions 
      });
      
      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore server errors during logout
    }
    
    await SecureStore.deleteItemAsync('userToken');
    set({ 
      user: null, 
      token: null, 
      userRole: null,
      userPermissions: [],
      isAuthenticated: false,
      error: null 
    });
  },

  // Utility methods for UI
  canAccessRoute: (route, requiredPermissions = [], requiredRole = null) => {
    const { isAuthenticated, hasPermission, hasMinimumRole } = get();
    
    if (!isAuthenticated) return false;
    
    if (requiredRole && !hasMinimumRole(requiredRole)) return false;
    
    if (requiredPermissions.length > 0) {
      return requiredPermissions.every(permission => hasPermission(permission));
    }
    
    return true;
  }
}));
