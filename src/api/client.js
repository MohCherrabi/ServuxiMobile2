import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG, getBaseURL } from './config';

const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync(API_CONFIG.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs communes
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      await SecureStore.deleteItemAsync(API_CONFIG.TOKEN_KEY);
      // TODO: Rediriger vers la page de connexion
      // NavigationService.navigate('Login');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
