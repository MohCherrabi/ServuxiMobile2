import { PERMISSIONS, ROLES, useRolePermissionStore } from '../store/rolePermissionStore';

/**
 * Custom hook for permission and role checking
 * Provides easy-to-use helper functions for components
 */
export const usePermissions = () => {
  const {
    user,
    userRole,
    userPermissions,
    isAuthenticated,
    hasPermission,
    hasRole,
    hasMinimumRole,
    hasAnyRole,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute
  } = useRolePermissionStore();

  // Role checking helpers
  const isVisitor = () => hasRole(ROLES.VISITOR.name);
  const isClient = () => hasRole(ROLES.CLIENT.name);
  const isProvider = () => hasRole(ROLES.PROVIDER.name);
  
  // Permission checking helpers
  const canEditProfile = () => hasPermission(PERMISSIONS.PROFILE_EDIT);
  const canViewProfile = () => hasPermission(PERMISSIONS.PROFILE_VIEW);

  // Service request permissions (clients)
  const canCreateRequests = () => hasPermission(PERMISSIONS.REQUEST_CREATE);
  const canEditRequests = () => hasPermission(PERMISSIONS.REQUEST_EDIT);
  const canViewRequests = () => hasPermission(PERMISSIONS.REQUEST_VIEW);
  const canDeleteRequests = () => hasPermission(PERMISSIONS.REQUEST_DELETE);

  // Service provision permissions (providers)
  const canCreateServices = () => hasPermission(PERMISSIONS.SERVICE_CREATE);
  const canEditServices = () => hasPermission(PERMISSIONS.SERVICE_EDIT);
  const canViewServices = () => hasPermission(PERMISSIONS.SERVICE_VIEW);
  const canDeleteServices = () => hasPermission(PERMISSIONS.SERVICE_DELETE);

  // Messaging permissions
  const canSendMessages = () => hasPermission(PERMISSIONS.MESSAGE_SEND);
  const canReadMessages = () => hasPermission(PERMISSIONS.MESSAGE_READ);
  const canDeleteMessages = () => hasPermission(PERMISSIONS.MESSAGE_DELETE);

  // Payment permissions
  const canProcessPayments = () => hasPermission(PERMISSIONS.PAYMENT_PROCESS);
  const canViewPayments = () => hasPermission(PERMISSIONS.PAYMENT_VIEW);

  // Subscription permissions (providers)
  const canManageSubscriptions = () => hasAnyPermission([
    PERMISSIONS.SUBSCRIPTION_CREATE,
    PERMISSIONS.SUBSCRIPTION_CANCEL
  ]);

  // Search and browse permissions
  const canSearchProviders = () => hasPermission(PERMISSIONS.SEARCH_PROVIDERS);
  const canBrowseServices = () => hasPermission(PERMISSIONS.BROWSE_SERVICES);

  // Review permissions
  const canCreateReviews = () => hasPermission(PERMISSIONS.REVIEW_CREATE);
  const canEditReviews = () => hasPermission(PERMISSIONS.REVIEW_EDIT);
  const canDeleteReviews = () => hasPermission(PERMISSIONS.REVIEW_DELETE);

  // Portfolio management (providers)
  const canManagePortfolio = () => hasPermission(PERMISSIONS.PORTFOLIO_MANAGE);

  // Combined permission checks for common operations
  const canProvideServices = () => hasMinimumRole(ROLES.PROVIDER.name);
  const canRequestServices = () => hasMinimumRole(ROLES.CLIENT.name);
  const hasFullAccess = () => hasMinimumRole(ROLES.PROVIDER.name);

  // UI visibility helpers
  const shouldShowProviderMenu = () => canProvideServices();
  const shouldShowClientMenu = () => canRequestServices();
  const shouldShowVisitorContent = () => isVisitor() || !isAuthenticated;
  
  const shouldShowServiceManagement = () => canCreateServices();
  const shouldShowRequestManagement = () => canCreateRequests();
  const shouldShowSubscriptionManagement = () => canManageSubscriptions();
  const shouldShowPortfolioManagement = () => canManagePortfolio();

  // Feature access helpers
  const canAccessFeature = (feature) => {
    const featurePermissions = {
      'service_creation': [PERMISSIONS.SERVICE_CREATE],
      'service_editing': [PERMISSIONS.SERVICE_EDIT],
      'request_creation': [PERMISSIONS.REQUEST_CREATE],
      'request_editing': [PERMISSIONS.REQUEST_EDIT],
      'messaging': [PERMISSIONS.MESSAGE_SEND, PERMISSIONS.MESSAGE_READ],
      'subscription_management': [PERMISSIONS.SUBSCRIPTION_CREATE],
      'portfolio_management': [PERMISSIONS.PORTFOLIO_MANAGE],
      'payment_processing': [PERMISSIONS.PAYMENT_PROCESS],
      'reviews': [PERMISSIONS.REVIEW_CREATE, PERMISSIONS.REVIEW_EDIT],
      'search': [PERMISSIONS.SEARCH_PROVIDERS, PERMISSIONS.BROWSE_SERVICES]
    };

    const requiredPermissions = featurePermissions[feature];
    return requiredPermissions ? hasAnyPermission(requiredPermissions) : false;
  };

  // Route access helpers
  const canAccessProviderRoutes = () => canProvideServices();
  const canAccessClientRoutes = () => canRequestServices();
  const canAccessPublicRoutes = () => true; // Accessible à tous

  // Error handling helpers
  const getPermissionError = (action) => {
    if (!isAuthenticated) {
      return "Vous devez être connecté pour effectuer cette action.";
    }
    
    const errorMessages = {
      'create_service': "Vous devez être prestataire pour créer un service.",
      'create_request': "Vous devez être client pour créer une demande.",
      'send_messages': "Vous devez être connecté pour envoyer des messages.",
      'manage_subscription': "Vous devez être prestataire pour gérer vos abonnements.",
      'manage_portfolio': "Vous devez être prestataire pour gérer votre portfolio.",
      'process_payments': "Vous devez être prestataire pour traiter les paiements.",
      'create_review': "Vous devez être connecté pour laisser un avis.",
      'default': "Vous n'avez pas les permissions nécessaires pour cette action."
    };

    return errorMessages[action] || errorMessages.default;
  };

  // Utility function to check multiple conditions
  const checkMultipleConditions = (conditions) => {
    return conditions.every(condition => {
      if (typeof condition === 'function') {
        return condition();
      }
      if (typeof condition === 'string') {
        return hasPermission(condition) || hasRole(condition);
      }
      return false;
    });
  };

  return {
    // User info
    user,
    userRole,
    userPermissions,
    isAuthenticated,

    // Basic permission/role functions
    hasPermission,
    hasRole,
    hasMinimumRole,
    hasAnyRole,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,

    // Role checking
    isVisitor,
    isClient,
    isProvider,

    // Profile permissions
    canEditProfile,
    canViewProfile,

    // Service request permissions (clients)
    canCreateRequests,
    canEditRequests,
    canViewRequests,
    canDeleteRequests,

    // Service provision permissions (providers)
    canCreateServices,
    canEditServices,
    canViewServices,
    canDeleteServices,

    // Messaging permissions
    canSendMessages,
    canReadMessages,
    canDeleteMessages,

    // Payment permissions
    canProcessPayments,
    canViewPayments,

    // Subscription permissions
    canManageSubscriptions,

    // Search and browse
    canSearchProviders,
    canBrowseServices,

    // Review permissions
    canCreateReviews,
    canEditReviews,
    canDeleteReviews,

    // Portfolio management
    canManagePortfolio,

    // Combined checks
    canProvideServices,
    canRequestServices,
    hasFullAccess,

    // UI helpers
    shouldShowProviderMenu,
    shouldShowClientMenu,
    shouldShowVisitorContent,
    shouldShowServiceManagement,
    shouldShowRequestManagement,
    shouldShowSubscriptionManagement,
    shouldShowPortfolioManagement,

    // Feature access
    canAccessFeature,

    // Route access
    canAccessProviderRoutes,
    canAccessClientRoutes,
    canAccessPublicRoutes,

    // Utilities
    getPermissionError,
    checkMultipleConditions
  };
};

export default usePermissions;
