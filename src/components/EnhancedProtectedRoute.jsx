import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useRolePermissionStore } from '../store/rolePermissionStore';

/**
 * EnhancedProtectedRoute - Advanced route protection with role and permission checks
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render if authorized
 * @param {string} props.redirectTo - Route to redirect to if not authorized
 * @param {string[]} props.requiredPermissions - Array of required permissions
 * @param {string} props.requiredRole - Exact role required
 * @param {string} props.minimumRole - Minimum role level required
 * @param {string[]} props.allowedRoles - Array of allowed roles
 * @param {boolean} props.requireAll - If true, user must have ALL permissions
 * @param {boolean} props.showUnauthorized - Show unauthorized message instead of redirect
 * @param {string} props.unauthorizedMessage - Custom unauthorized message
 */
export const EnhancedProtectedRoute = ({
  children,
  redirectTo = '/login',
  requiredPermissions = [],
  requiredRole = null,
  minimumRole = null,
  allowedRoles = [],
  requireAll = true,
  showUnauthorized = false,
  unauthorizedMessage = "Vous n'avez pas l'autorisation d'accéder à cette page."
}) => {
  const {
    isAuthenticated,
    isLoading,
    hasPermission,
    hasRole,
    hasMinimumRole,
    hasAnyRole,
    hasAnyPermission,
    hasAllPermissions
  } = useRolePermissionStore();

  // Show loading state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFC700" />
        <Text style={{ marginTop: 16, color: '#666' }}>Chargement...</Text>
      </View>
    );
  }

  // Check authentication
  if (!isAuthenticated) {
    return <Redirect href={redirectTo} />;
  }

  // Check role requirements
  if (requiredRole && !hasRole(requiredRole)) {
    if (showUnauthorized) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, color: '#c62828', textAlign: 'center', marginBottom: 16 }}>
            Accès refusé
          </Text>
          <Text style={{ color: '#666', textAlign: 'center' }}>
            Rôle requis: {requiredRole}
          </Text>
        </View>
      );
    }
    return <Redirect href={redirectTo} />;
  }

  if (minimumRole && !hasMinimumRole(minimumRole)) {
    if (showUnauthorized) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, color: '#c62828', textAlign: 'center', marginBottom: 16 }}>
            Accès refusé
          </Text>
          <Text style={{ color: '#666', textAlign: 'center' }}>
            Niveau d'autorisation insuffisant
          </Text>
        </View>
      );
    }
    return <Redirect href={redirectTo} />;
  }

  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    if (showUnauthorized) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, color: '#c62828', textAlign: 'center', marginBottom: 16 }}>
            Accès refusé
          </Text>
          <Text style={{ color: '#666', textAlign: 'center' }}>
            Rôles autorisés: {allowedRoles.join(', ')}
          </Text>
        </View>
      );
    }
    return <Redirect href={redirectTo} />;
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAll 
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasRequiredPermissions) {
      if (showUnauthorized) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 18, color: '#c62828', textAlign: 'center', marginBottom: 16 }}>
              Accès refusé
            </Text>
            <Text style={{ color: '#666', textAlign: 'center' }}>
              {unauthorizedMessage}
            </Text>
          </View>
        );
      }
      return <Redirect href={redirectTo} />;
    }
  }

  // All checks passed, render children
  return children;
};

/**
 * ClientRoute - Quick client-only route protection
 */
export const ClientRoute = ({ children, redirectTo = '/login' }) => (
  <EnhancedProtectedRoute minimumRole="client" redirectTo={redirectTo}>
    {children}
  </EnhancedProtectedRoute>
);

/**
 * ProviderRoute - Quick provider-only route protection
 */
export const ProviderRoute = ({ children, redirectTo = '/login' }) => (
  <EnhancedProtectedRoute minimumRole="provider" redirectTo={redirectTo}>
    {children}
  </EnhancedProtectedRoute>
);

/**
 * AuthenticatedRoute - Route protection for any authenticated user
 */
export const AuthenticatedRoute = ({ children, redirectTo = '/login' }) => (
  <EnhancedProtectedRoute allowedRoles={['client', 'provider']} redirectTo={redirectTo}>
    {children}
  </EnhancedProtectedRoute>
);

/**
 * PublicRoute - Route accessible to all users (including visitors)
 */
export const PublicRoute = ({ children }) => (
  <>{children}</>
);

export default EnhancedProtectedRoute;
