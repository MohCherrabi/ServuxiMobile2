import axios from 'axios';

/*
 * API Service - Easy transition from JSON to Real APIs
 * 
 * CURRENT STATE (Development):
 * - Uses local JSON file (assets/data.json)
 * - Simulates network delays
 * - No actual HTTP requests
 * 
 * TO SWITCH TO REAL APIs (Production):
 * 1. Update API_CONFIG.baseURL to your API domain
 * 2. Uncomment the axios calls in each function
 * 3. Comment out the local JSON require() calls
 * 4. Add authentication headers if needed
 * 
 * Example:
 * - Change: const localData = require('../../assets/data.json');
 * - To: const response = await apiClient.get(ENDPOINTS.homeData);
 */

// API Configuration
const API_CONFIG = {
  // For development: using local JSON file
  baseURL: '', // Will be your API domain later (e.g., 'https://api.servuxi.com')
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // Add authentication headers here when needed
    // 'Authorization': `Bearer ${token}`
  }
};

// Create axios instance
const apiClient = axios.create(API_CONFIG);

// API Endpoints - Easy to change to real endpoints later
const ENDPOINTS = {
  // For development: using local JSON
  homeData: '/assets/data.json',
  searchData: '/assets/data.json',
  cities: '/assets/data.json',
  categories: '/assets/data.json',
  
  // Real API endpoints (to be used later)
  // homeData: '/api/home',
  // searchData: '/api/search',
  // cities: '/api/cities',
  // categories: '/api/categories',
};

// API Service Functions
export const apiService = {
  // Home Screen Data
  getHomeData: async () => {
    try {
      // For development: Use local JSON file
      // TODO: Replace with real API call when ready
      // const response = await apiClient.get(ENDPOINTS.homeData);
      
      // Simulate API response with local data
      const localData = require('../../assets/data.json');
      
      // Simulate network delay (optional)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        data: localData.homeScreen
      };
    } catch (error) {
      console.error('API Error - getHomeData:', error);
      return {
        success: false,
        error: error.message,
        fallback: () => require('../../assets/data.json').homeScreen
      };
    }
  },

  // Search Data (Cities & Categories)
  getSearchData: async () => {
    try {
      // For development: Use local JSON file
      // TODO: Replace with real API call when ready
      // const response = await apiClient.get(ENDPOINTS.searchData);
      
      // Simulate API response with local data
      const localData = require('../../assets/data.json');
      
      // Simulate network delay (optional)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        success: true,
        data: {
          cities: localData.cities || [],
          categories: localData.categories || []
        }
      };
    } catch (error) {
      console.error('API Error - getSearchData:', error);
      const fallbackData = require('../../assets/data.json');
      return {
        success: false,
        error: error.message,
        fallback: {
          cities: fallbackData.cities || [],
          categories: fallbackData.categories || []
        }
      };
    }
  },

  // Search Providers
  searchProviders: async (searchParams) => {
    try {
      // For development: Use local JSON file
      // TODO: Replace with real API call when ready
      // const response = await apiClient.post('/api/search/providers', searchParams);
      
      // Simulate API response with local data
      const localData = require('../../assets/data.json');
      
      // Simulate network delay (optional)
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return {
        success: true,
        data: localData.homeScreen?.featuredProviders || []
      };
    } catch (error) {
      console.error('API Error - searchProviders:', error);
      return {
        success: false,
        error: error.message,
        fallback: () => require('../../assets/data.json').homeScreen.featuredProviders || []
      };
    }
  },

  // Get Cities
  getCities: async () => {
    try {
      // For development: Use local JSON file
      // TODO: Replace with real API call when ready
      // const response = await apiClient.get(ENDPOINTS.cities);
      
      const localData = require('../../assets/data.json');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return {
        success: true,
        data: localData.cities || []
      };
    } catch (error) {
      console.error('API Error - getCities:', error);
      return {
        success: false,
        error: error.message,
        fallback: () => require('../../assets/data.json').cities || []
      };
    }
  },

  // Get Categories
  getCategories: async () => {
    try {
      // For development: Use local JSON file
      // TODO: Replace with real API call when ready
      // const response = await apiClient.get(ENDPOINTS.categories);
      
      const localData = require('../../assets/data.json');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return {
        success: true,
        data: localData.categories || []
      };
    } catch (error) {
      console.error('API Error - getCategories:', error);
      return {
        success: false,
        error: error.message,
        fallback: () => require('../../assets/data.json').categories || []
      };
    }
  }
};

// Helper function to handle API responses with fallback
export const handleApiResponse = (response) => {
  if (response.success) {
    return response.data;
  } else {
    console.warn('API call failed, using fallback data:', response.error);
    return typeof response.fallback === 'function' ? response.fallback() : response.fallback;
  }
};

// Export API client for custom requests
export { apiClient };
export default apiService;
