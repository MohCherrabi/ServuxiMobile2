// API Configuration
export const API_CONFIG = {
  // Base URLs
  BASE_URL: 'https://VOTRE_API_LARAVEL.com/api', // TODO: Remplacer par l'URL de production
  BASE_URL_DEV: 'http://localhost:8000/api', // URL de développement
  
  // Timeouts
  TIMEOUT: 10000, // 10 seconds
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  
  // Token storage key
  TOKEN_KEY: 'userToken',
  
  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/login',
      REGISTER: '/register',
      LOGOUT: '/logout',
      REFRESH: '/refresh',
      FORGOT_PASSWORD: '/password/forgot',
      RESET_PASSWORD: '/password/reset',
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE_PROFILE: '/user/profile',
      CHANGE_PASSWORD: '/user/change-password',
    },
    // TODO: Ajouter d'autres endpoints selon les besoins de l'application
  },
  
  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Get the appropriate base URL based on environment
export const getBaseURL = () => {
  if (__DEV__) {
    return API_CONFIG.BASE_URL_DEV;
  }
  return API_CONFIG.BASE_URL;
};
