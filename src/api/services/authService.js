import apiClient from '../client';

class AuthService {
  // Login user
  async login(credentials) {
    try {
      const response = await apiClient.post('/login', credentials);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await apiClient.post('/register', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Logout user
  async logout() {
    try {
      const response = await apiClient.post('/logout');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await apiClient.get('/user/profile');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await apiClient.put('/user/profile', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/password/forgot', { email });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Reset password
  async resetPassword(data) {
    try {
      const response = await apiClient.post('/password/reset', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data.message || 'Une erreur est survenue',
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Erreur de connexion. Vérifiez votre connexion internet.',
        status: 0,
      };
    } else {
      // Other error
      return {
        message: error.message || 'Une erreur inattendue est survenue',
        status: -1,
      };
    }
  }
}

export default new AuthService();
