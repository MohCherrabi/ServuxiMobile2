import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import authService from '../api/services/authService';

// Custom storage for Zustand with SecureStore
const secureStorage = {
  getItem: async (name) => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch {
      // Ignore errors
    }
  },
  removeItem: async (name) => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch {
      // Ignore errors
    }
  },
};

export const useAuthStoreEnhanced = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      // Actions
      initializeAuth: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = await SecureStore.getItemAsync('userToken');
          if (token) {
            // Vérifier la validité du token
            try {
              const profile = await authService.getProfile();
              set({ 
                user: profile.user || profile, 
                token, 
                isAuthenticated: true, 
                isLoading: false 
              });
            } catch (error) {
              // Token invalide, nettoyer
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

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });
          const { token, user } = response;
          
          await SecureStore.setItemAsync('userToken', token);
          set({ 
            user, 
            token, 
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

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(userData);
          const { token, user } = response;
          
          await SecureStore.setItemAsync('userToken', token);
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
          
          return { success: true };
        } catch (error) {
          set({ 
            error: error.message || 'Erreur d\'inscription', 
            isLoading: false 
          });
          return { success: false, error: error.message };
        }
      },

      logout: async () => {
        try {
          // Tenter de notifier le serveur
          await authService.logout();
        } catch {
          // Ignorer les erreurs de logout côté serveur
        }
        
        await SecureStore.deleteItemAsync('userToken');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          error: null 
        });
      },

      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.updateProfile(userData);
          set({ 
            user: response.user || response, 
            isLoading: false,
            error: null 
          });
          return { success: true };
        } catch (error) {
          set({ 
            error: error.message || 'Erreur de mise à jour', 
            isLoading: false 
          });
          return { success: false, error: error.message };
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
