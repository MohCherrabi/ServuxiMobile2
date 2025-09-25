import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import apiClient from '../api/client';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  userType: null, // 'client' ou 'provider'

  // Action pour tenter de charger le token au démarrage de l'app
  initializeAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        // Optionnel : vérifier la validité du token auprès de l'API
        // const { data } = await apiClient.get('/auth/me');
        // set({ user: data, token, isAuthenticated: true, isLoading: false });
        set({ token, isAuthenticated: true, isLoading: false }); // Version simplifiée
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      set({ isLoading: false });
    }
  },

  // Action de connexion
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token, user } = response.data;
    await SecureStore.setItemAsync('userToken', token);
    set({ user, token, isAuthenticated: true });
  },

  // Action de déconnexion
  logout: async () => {
    await SecureStore.deleteItemAsync('userToken');
    set({ user: null, token: null, isAuthenticated: false, userType: null });
  },

  // Action pour définir le type d'utilisateur
  setUserType: (type) => set({ userType: type }),
}));
