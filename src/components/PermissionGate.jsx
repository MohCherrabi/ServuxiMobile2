import React from 'react';
import { Text, View } from 'react-native';
import { useRolePermissionStore } from '../store/rolePermissionStore';

/**
 * PermissionGate - Renders children only if user has required permissions/roles
 * 
 * @param {Object} props
 * @param {string[]} props.permissions - Array of required permissions
 * @param {string} props.role - Required role (exact match)
 * @param {string} props.minimumRole - Minimum role level required
 * @param {string[]} props.roles - Array of acceptable roles (any match)
 * @param {boolean} props.requireAll - If true, user must have ALL permissions (default: true)
 * @param {React.ReactNode} props.children - Content to render if authorized
 * @param {React.ReactNode} props.fallback - Content to render if not authorized
 * @param {boolean} props.showError - Whether to show error message when unauthorized
 * @param {string} props.errorMessage - Custom error message
 */
export const PermissionGate = ({
  permissions = [],
  role = null,
  minimumRole = null,
  roles = [],
  requireAll = true,
  children,
  fallback = null,
  showError = false,
  errorMessage = "Vous n'avez pas les permissions nécessaires pour accéder à cette fonctionnalité."
}) => {
  const {
    isAuthenticated,
    hasPermission,
    hasRole,
    hasMinimumRole,
    hasAnyRole,
    hasAnyPermission,
    hasAllPermissions
  } = useRolePermissionStore();

  // Check authentication first
  if (!isAuthenticated) {
    if (showError) {
      return (
        <View style={{ padding: 16, backgroundColor: '#ffebee', borderRadius: 8 }}>
          <Text style={{ color: '#c62828', textAlign: 'center' }}>
            Vous devez être connecté pour accéder à cette fonctionnalité.
          </Text>
        </View>
      );
    }
    return fallback;
  }

  // Check role requirements
  if (role && !hasRole(role)) {
    return showError ? (
      <View style={{ padding: 16, backgroundColor: '#ffebee', borderRadius: 8 }}>
        <Text style={{ color: '#c62828', textAlign: 'center' }}>
          Rôle requis: {role}
        </Text>
      </View>
    ) : fallback;
  }

  if (minimumRole && !hasMinimumRole(minimumRole)) {
    return showError ? (
      <View style={{ padding: 16, backgroundColor: '#ffebee', borderRadius: 8 }}>
        <Text style={{ color: '#c62828', textAlign: 'center' }}>
          Niveau d'autorisation insuffisant.
        </Text>
      </View>
    ) : fallback;
  }

  if (roles.length > 0 && !hasAnyRole(roles)) {
    return showError ? (
      <View style={{ padding: 16, backgroundColor: '#ffebee', borderRadius: 8 }}>
        <Text style={{ color: '#c62828', textAlign: 'center' }}>
          Rôle requis: {roles.join(' ou ')}
        </Text>
      </View>
    ) : fallback;
  }

  // Check permission requirements
  if (permissions.length > 0) {
    const hasRequiredPermissions = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);

    if (!hasRequiredPermissions) {
      return showError ? (
        <View style={{ padding: 16, backgroundColor: '#ffebee', borderRadius: 8 }}>
          <Text style={{ color: '#c62828', textAlign: 'center' }}>
            {errorMessage}
          </Text>
        </View>
      ) : fallback;
    }
  }

  // All checks passed, render children
  return children;
};

/**
 * RoleGate - Simple role-based gate
 */
export const RoleGate = ({ role, minimumRole, roles, children, fallback = null }) => (
  <PermissionGate 
    role={role}
    minimumRole={minimumRole}
    roles={roles}
    fallback={fallback}
  >
    {children}
  </PermissionGate>
);

/**
 * VisitorGate - Content visible only to visitors (non-authenticated users)
 */
export const VisitorGate = ({ children, fallback = null }) => (
  <PermissionGate roles={["visitor"]} fallback={fallback}>
    {children}
  </PermissionGate>
);

/**
 * ClientGate - Quick gate for client-only content
 */
export const ClientGate = ({ children, fallback = null }) => (
  <PermissionGate minimumRole="client" fallback={fallback}>
    {children}
  </PermissionGate>
);

/**
 * ProviderGate - Quick gate for provider-only content
 */
export const ProviderGate = ({ children, fallback = null }) => (
  <PermissionGate minimumRole="provider" fallback={fallback}>
    {children}
  </PermissionGate>
);

/**
 * AuthenticatedGate - Content for any authenticated user (client or provider)
 */
export const AuthenticatedGate = ({ children, fallback = null }) => (
  <PermissionGate roles={["client", "provider"]} fallback={fallback}>
    {children}
  </PermissionGate>
);

/**
 * withPermissions - HOC for permission-based component protection
 */
export const withPermissions = (WrappedComponent, permissionConfig = {}) => {
  return (props) => (
    <PermissionGate {...permissionConfig}>
      <WrappedComponent {...props} />
    </PermissionGate>
  );
};

export default PermissionGate;
