import apiClient from '../client';

/**
 * Service for role and permission management API calls
 */
class RolePermissionService {
  
  // ==========================================
  // ROLE MANAGEMENT
  // ==========================================
  
  /**
   * Get all available roles
   */
  async getRoles() {
    try {
      const response = await apiClient.get('/roles');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user's current role and permissions
   */
  async getUserProfile(userId = null) {
    try {
      const endpoint = userId ? `/users/${userId}/profile` : '/auth/me';
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(userId, newRole) {
    try {
      const response = await apiClient.put(`/users/${userId}/role`, {
        role: newRole
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all permissions for a specific role
   */
  async getRolePermissions(roleName) {
    try {
      const response = await apiClient.get(`/roles/${roleName}/permissions`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==========================================
  // PERMISSION MANAGEMENT
  // ==========================================

  /**
   * Get all available permissions
   */
  async getPermissions() {
    try {
      const response = await apiClient.get('/permissions');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check if user has specific permission
   */
  async checkPermission(permission, userId = null) {
    try {
      const params = userId ? { user_id: userId } : {};
      const response = await apiClient.get(`/permissions/${permission}/check`, { params });
      return response.data.hasPermission;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check multiple permissions at once
   */
  async checkMultiplePermissions(permissions, userId = null) {
    try {
      const response = await apiClient.post('/permissions/check-multiple', {
        permissions,
        user_id: userId
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Grant permission to user
   */
  async grantPermission(userId, permission) {
    try {
      const response = await apiClient.post(`/users/${userId}/permissions`, {
        permission
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Revoke permission from user
   */
  async revokePermission(userId, permission) {
    try {
      const response = await apiClient.delete(`/users/${userId}/permissions/${permission}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==========================================
  // USER MANAGEMENT
  // ==========================================

  /**
   * Get all users with their roles and permissions
   */
  async getUsers(page = 1, limit = 20, filters = {}) {
    try {
      const response = await apiClient.get('/users', {
        params: {
          page,
          limit,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role, page = 1, limit = 20) {
    try {
      const response = await apiClient.get(`/users/role/${role}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new user with role
   */
  async createUser(userData) {
    try {
      const response = await apiClient.post('/users', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update user information
   */
  async updateUser(userId, userData) {
    try {
      const response = await apiClient.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userId) {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Suspend user account
   */
  async suspendUser(userId, reason = '') {
    try {
      const response = await apiClient.post(`/users/${userId}/suspend`, {
        reason
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Reactivate suspended user
   */
  async reactivateUser(userId) {
    try {
      const response = await apiClient.post(`/users/${userId}/reactivate`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==========================================
  // PROVIDER MANAGEMENT
  // ==========================================

  /**
   * Get pending provider verifications
   */
  async getPendingProviders() {
    try {
      const response = await apiClient.get('/providers/pending');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Verify provider
   */
  async verifyProvider(providerId, verificationData = {}) {
    try {
      const response = await apiClient.post(`/providers/${providerId}/verify`, verificationData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Reject provider verification
   */
  async rejectProvider(providerId, reason = '') {
    try {
      const response = await apiClient.post(`/providers/${providerId}/reject`, {
        reason
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Suspend provider
   */
  async suspendProvider(providerId, reason = '') {
    try {
      const response = await apiClient.post(`/providers/${providerId}/suspend`, {
        reason
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==========================================
  // AUDIT & LOGGING
  // ==========================================

  /**
   * Get user activity log
   */
  async getUserActivityLog(userId, page = 1, limit = 20) {
    try {
      const response = await apiClient.get(`/users/${userId}/activity`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get permission usage analytics
   */
  async getPermissionAnalytics(dateRange = {}) {
    try {
      const response = await apiClient.get('/analytics/permissions', {
        params: dateRange
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Log permission usage (for analytics)
   */
  async logPermissionUsage(permission, action, metadata = {}) {
    try {
      const response = await apiClient.post('/analytics/permissions/log', {
        permission,
        action,
        metadata,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      // Don't throw errors for analytics logging
      console.warn('Failed to log permission usage:', error);
      return null;
    }
  }

  // ==========================================
  // CONTENT MODERATION
  // ==========================================

  /**
   * Get reported content
   */
  async getReportedContent(page = 1, limit = 20, status = 'pending') {
    try {
      const response = await apiClient.get('/moderation/reports', {
        params: { page, limit, status }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Moderate content
   */
  async moderateContent(contentId, action, reason = '') {
    try {
      const response = await apiClient.post(`/moderation/content/${contentId}/${action}`, {
        reason
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get moderation queue
   */
  async getModerationQueue(type = 'all', page = 1, limit = 20) {
    try {
      const response = await apiClient.get('/moderation/queue', {
        params: { type, page, limit }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  /**
   * Standardized error handling
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          return new Error('Session expirée. Veuillez vous reconnecter.');
        case 403:
          return new Error('Permissions insuffisantes pour cette action.');
        case 404:
          return new Error('Ressource non trouvée.');
        case 422:
          return new Error(data.message || 'Données invalides.');
        case 500:
          return new Error('Erreur serveur. Veuillez réessayer plus tard.');
        default:
          return new Error(data.message || 'Une erreur est survenue.');
      }
    } else if (error.request) {
      // Network error
      return new Error('Erreur de connexion. Vérifiez votre connexion internet.');
    } else {
      // Other error
      return new Error(error.message || 'Une erreur inattendue est survenue.');
    }
  }

  /**
   * Helper to construct API endpoints based on environment
   */
  getEndpoint(path) {
    const baseURL = process.env.EXPO_PUBLIC_API_URL || 'https://api.servuxi.com';
    return `${baseURL}${path}`;
  }

  /**
   * Batch permission check for performance
   */
  async batchCheckPermissions(permissionChecks) {
    try {
      const response = await apiClient.post('/permissions/batch-check', {
        checks: permissionChecks
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Refresh user permissions (useful after role changes)
   */
  async refreshUserPermissions(userId = null) {
    try {
      const endpoint = userId ? `/users/${userId}/refresh-permissions` : '/auth/refresh-permissions';
      const response = await apiClient.post(endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export default new RolePermissionService();
