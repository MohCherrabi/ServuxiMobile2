import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

// Hook personnalisé pour simplifier l'utilisation du store d'auth
export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    initializeAuth,
    login,
    logout,
  } = useAuthStore();

  // Initialiser l'authentification au montage du composant
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};

export default useAuth;
