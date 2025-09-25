import { Redirect } from 'expo-router';
import React from 'react';
import { useAuthStore } from '../store/authStore';

// Composant pour protéger les routes qui nécessitent une authentification
export const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return null; // ou un composant de loading
  }

  if (!isAuthenticated) {
    return <Redirect href={redirectTo} />;
  }

  return children;
};

export default ProtectedRoute;
