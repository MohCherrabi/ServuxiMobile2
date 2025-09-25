import * as SecureStore from 'expo-secure-store';
import apiClient from './client';

// Response interceptor for handling common errors
export const setupResponseInterceptor = () => {
  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        await SecureStore.deleteItemAsync('userToken');
        // TODO: Redirect to login screen
        // NavigationService.navigate('Login');
      }
      
      return Promise.reject(error);
    }
  );
};

// Request interceptor for adding common headers or logging
export const setupRequestInterceptor = () => {
  apiClient.interceptors.request.use(
    (config) => {
      // Add request timestamp for debugging
      config.metadata = { requestStartedAt: new Date().getTime() };
      
      // TODO: Add any other common headers or request modifications
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// Initialize all interceptors
export const initializeInterceptors = () => {
  setupRequestInterceptor();
  setupResponseInterceptor();
};
