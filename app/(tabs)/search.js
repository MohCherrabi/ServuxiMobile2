import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  I18nManager,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LanguageToggle from '../../src/components/LanguageToggle';
import { usePermissions } from '../../src/hooks/usePermissions';
import { apiService, handleApiResponse } from '../../src/services/apiService';
import { intelligentSearchService } from '../../src/services/intelligentSearchService';

const logo = require('../../assets/images/servuxiLogo.png');

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const { isAuthenticated, isClient, isProvider, canBrowseServices } = usePermissions();
  const isRTL = I18nManager.isRTL;

  // États pour la recherche
  const [searchText, setSearchText] = useState('');
  const [selectedCity, setSelectedCity] = useState(null); // Store actual city value
  const [selectedCategory, setSelectedCategory] = useState(null); // Store actual category value
  const [showCityModal, setShowCityModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  
  // États pour les filtres intelligents
  const [filters, setFilters] = useState({
    minRating: 0,
    minExperience: 0,
    maxDistance: 50,
    availableNow: false,
    sortBy: 'relevance' // relevance, rating, distance, experience
  });

  useEffect(() => {
    // Charger les données depuis le JSON
    loadDataFromAPIs();
  }, []);


  const loadDataFromAPIs = async () => {
    setLoading(true);
    try {
      // Using API service - easily replaceable with real API calls later
      // TODO: Just change the endpoints in apiService.js when APIs are ready
      
      const response = await apiService.getSearchData();
      const data = handleApiResponse(response);
      
      // Charger les villes et catégories depuis l'API
      setCities(data.cities || []);
      setCategories(data.categories || []);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    
    setLoading(true);
    try {
      const searchParams = {
        text: searchText,
        city: selectedCity !== 'Ville' ? selectedCity : null,
        category: selectedCategory !== 'Catégorie' ? selectedCategory : null,
        userLocation: selectedCity !== 'Ville' ? selectedCity : null,
        ...filters
      };
      
      console.log('Recherche intelligente:', searchParams);
      
      // Using API service for search
      const response = await apiService.searchProviders(searchParams);
      let results = handleApiResponse(response);
      
      // Apply search filtering first (most important)
      if (searchText && searchText.trim()) {
        results = intelligentSearchService.sortByRelevance(results, searchText.trim());
      }
      
      // Then apply other filters (rating, experience, distance, availability)
      results = intelligentSearchService.applyIntelligentFilters(results, {
        ...filters,
        searchText,
        userLocation: searchParams.userLocation
      });
      
      setSearchResults(results || []);
      
      // Sauvegarder dans l'historique
      intelligentSearchService.saveSearchToHistory(searchParams, results);
      
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    
    // Obtenir des suggestions de recherche
    if (text.length > 2) {
      const suggestions = intelligentSearchService.getSearchSuggestions(text);
      setSearchSuggestions(suggestions);
      
      // Obtenir des suggestions de catégories intelligentes
      const catSuggestions = intelligentSearchService.getSmartCategorySuggestions(text);
      setCategorySuggestions(catSuggestions);
    } else {
      setSearchSuggestions([]);
      setCategorySuggestions([]);
    }
  };

  const applyFilter = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      minRating: 0,
      minExperience: 0,
      maxDistance: 50,
      availableNow: false,
      sortBy: 'relevance'
    });
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setShowCityModal(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.name);
    setShowCategoryModal(false);
  };

  const handleProviderPress = (provider) => {
    console.log('Provider selected:', provider);
    router.push(`/provider/${provider.user_id}`);
  };

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  // Helper functions to get display text
  const getCityDisplayText = () => {
    return selectedCity || t('city');
  };

  const getCategoryDisplayText = () => {
    return selectedCategory || t('category');
  };


  return (
    <View style={styles.container}>
      {/* Header personnalisé */}
      <View style={[styles.header, { 
        paddingTop: insets.top + 10,
        flexDirection: isRTL ? 'row-reverse' : 'row'
      }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        
        {/* Language Toggle */}
        <LanguageToggle />

        <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Section de Recherche */}
        <View style={styles.searchSection}>
          {/* Barre de recherche */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('findServices')}
              value={searchText}
              onChangeText={handleSearchTextChange}
              onSubmitEditing={handleSearch}
              placeholderTextColor="#999"
            />
          </View>

          {/* Suggestions de recherche */}
          {searchSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>{t('suggestions')}</Text>
              {searchSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setSearchText(suggestion.text);
                    setSearchSuggestions([]);
                    handleSearch();
                  }}
                >
                  <Ionicons 
                    name={suggestion.type === 'history' ? 'time-outline' : 'trending-up-outline'} 
                    size={16} 
                    color="#666" 
                  />
                  <View style={styles.suggestionTextContainer}>
                    <Text style={styles.suggestionText}>{suggestion.text}</Text>
                    <Text style={styles.suggestionSubtitle}>{suggestion.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Dropdowns et Filtres */}
          <View style={styles.filtersRow}>
            {/* Dropdown Ville */}
            <View style={styles.dropdownContainer}>
              <TouchableOpacity 
                style={styles.dropdown}
                onPress={() => setShowCityModal(true)}
              >
                <Text style={[styles.dropdownText, !selectedCity && styles.placeholderText]}>
                  {getCityDisplayText()}
                </Text>
                <View style={styles.dropdownIcons}>
                  {selectedCity && (
                    <TouchableOpacity 
                      style={styles.resetIcon}
                      onPress={() => setSelectedCity(null)}
                    >
                      <Ionicons name="close-circle" size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                  )}
                  <Ionicons name="chevron-down" size={16} color="#999" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Dropdown Catégorie */}
            <View style={styles.dropdownContainer}>
              <TouchableOpacity 
                style={styles.dropdown}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={[styles.dropdownText, !selectedCategory && styles.placeholderText]}>
                  {getCategoryDisplayText()}
                </Text>
                <View style={styles.dropdownIcons}>
                  {selectedCategory && (
                    <TouchableOpacity 
                      style={styles.resetIcon}
                      onPress={() => setSelectedCategory(null)}
                    >
                      <Ionicons name="close-circle" size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                  )}
                  <Ionicons name="chevron-down" size={16} color="#999" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Reset All Button */}
          {(selectedCity || selectedCategory || filters.minRating > 0 || filters.minExperience > 0 || filters.availableNow) && (
            <TouchableOpacity 
              style={styles.resetAllButton}
              onPress={() => {
                setSelectedCity(null);
                setSelectedCategory(null);
                resetFilters();
                setSearchResults([]);
              }}
            >
              <Ionicons name="refresh-outline" size={16} color="#FF6B6B" />
              <Text style={styles.resetAllText}>{t('resetAllFilters')}</Text>
            </TouchableOpacity>
          )}

          {/* Boutons de filtres intelligents */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.intelligentFiltersScrollView}
            contentContainerStyle={styles.intelligentFiltersRow}
          >
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFiltersModal(true)}
            >
              <Ionicons name="options-outline" size={16} color="#FFC700" />
              <Text style={styles.filterButtonText}>{t('filters')}</Text>
              {(filters.minRating > 0 || filters.minExperience > 0 || filters.availableNow) && (
                <View style={styles.filterActiveDot} />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.filterButton, filters.availableNow && styles.filterButtonActive]}
              onPress={() => applyFilter('availableNow', !filters.availableNow)}
            >
              <Ionicons name="time-outline" size={16} color={filters.availableNow ? "#FFF" : "#FFC700"} />
              <Text style={[styles.filterButtonText, filters.availableNow && styles.filterButtonTextActive]}>
                {t('available')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => applyFilter('sortBy', filters.sortBy === 'rating' ? 'relevance' : 'rating')}
            >
              <Ionicons name="star-outline" size={16} color="#FFC700" />
              <Text style={styles.filterButtonText}>
                {filters.sortBy === 'rating' ? 'Mieux notés' : 'Pertinence'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.filterButton, filters.minExperience > 0 && styles.filterButtonActive]}
              onPress={() => applyFilter('minExperience', filters.minExperience === 5 ? 0 : 5)}
            >
              <Ionicons name="calendar-outline" size={16} color={filters.minExperience > 0 ? "#FFF" : "#FFC700"} />
              <Text style={[styles.filterButtonText, filters.minExperience > 0 && styles.filterButtonTextActive]}>
                {filters.minExperience > 0 ? `${filters.minExperience}+ ans` : 'Ancienneté'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.filterButton, filters.minRating > 0 && styles.filterButtonActive]}
              onPress={() => applyFilter('minRating', filters.minRating === 4 ? 0 : 4)}
            >
              <Ionicons name="star" size={16} color={filters.minRating > 0 ? "#FFF" : "#FFC700"} />
              <Text style={[styles.filterButtonText, filters.minRating > 0 && styles.filterButtonTextActive]}>
                {filters.minRating > 0 ? `${filters.minRating}+ ⭐` : 'Notes'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.filterButton, filters.maxDistance < 50 && styles.filterButtonActive]}
              onPress={() => applyFilter('maxDistance', filters.maxDistance === 25 ? 50 : 25)}
            >
              <Ionicons name="location-outline" size={16} color={filters.maxDistance < 50 ? "#FFF" : "#FFC700"} />
              <Text style={[styles.filterButtonText, filters.maxDistance < 50 && styles.filterButtonTextActive]}>
                {filters.maxDistance < 50 ? `${filters.maxDistance}km` : 'Distance'}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Suggestions intelligentes de catégories */}
          {categorySuggestions.length > 0 && (
            <View style={styles.aiSuggestionsContainer}>
              <View style={styles.aiSuggestionsHeader}>
                <Ionicons name="bulb-outline" size={16} color="#FFC700" />
                <Text style={styles.aiSuggestionsTitle}>{t('aiSuggestions')}</Text>
              </View>
              {categorySuggestions.slice(0, 3).map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.aiSuggestionItem}
                  onPress={() => {
                    setSelectedCategory(suggestion.category);
                    setCategorySuggestions([]);
                    handleSearch();
                  }}
                >
                  <View style={styles.aiSuggestionContent}>
                    <Text style={styles.aiSuggestionCategory}>{suggestion.category}</Text>
                    <Text style={styles.aiSuggestionReason}>{suggestion.reason}</Text>
                  </View>
                  <View style={styles.confidenceContainer}>
                    <Text style={styles.confidenceText}>{Math.round(suggestion.confidence)}%</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Résultats de recherche */}
        {searchResults.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>{t('searchResults')}</Text>
            
            {searchResults.map((provider, index) => (
              <TouchableOpacity
                key={`search-${provider.user_id}-${index}`}
                style={styles.resultCard}
                onPress={() => handleProviderPress(provider)}
                activeOpacity={0.8}
              >
                <View style={styles.resultCardWrapper}>
                  <Image source={{ uri: provider.profile_picture_url }} style={styles.resultProviderImage} />
                  <View style={styles.resultProviderInfo}>
                    <Text style={styles.resultProviderName}>{provider.name}</Text>
                    <Text style={styles.resultProviderSpecialty}>{provider.specialty}</Text>
                    <Text style={styles.resultProviderCity}>{provider.city}</Text>
                    <View style={styles.resultRatingContainer}>
                      <Ionicons name="star" size={14} color="#FFC700" />
                      <Text style={styles.resultRatingText}>{provider.rating.average}</Text>
                      <Text style={styles.resultRatingCount}>({provider.rating.count})</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modal pour sélection de ville */}
      <Modal
        visible={showCityModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('selectCity')}</Text>
              <View style={styles.modalHeaderButtons}>
                {selectedCity && (
                  <TouchableOpacity 
                    style={styles.modalResetButton}
                    onPress={() => {
                      setSelectedCity(null);
                      setShowCityModal(false);
                    }}
                  >
                    <Text style={styles.modalResetText}>{t('reset')}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setShowCityModal(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
            
            <FlatList
              data={cities}
              keyExtractor={(item, index) => `city-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleCitySelect(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Modal pour sélection de catégorie */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('selectCategory')}</Text>
              <View style={styles.modalHeaderButtons}>
                {selectedCategory && (
                  <TouchableOpacity 
                    style={styles.modalResetButton}
                    onPress={() => {
                      setSelectedCategory(null);
                      setShowCategoryModal(false);
                    }}
                  >
                    <Text style={styles.modalResetText}>{t('reset')}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
            
            <FlatList
              data={categories}
              keyExtractor={(item) => `category-${item.id}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleCategorySelect(item)}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Modal pour filtres avancés */}
      <Modal
        visible={showFiltersModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFiltersModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filtersModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('intelligentFilters')}</Text>
              <TouchableOpacity onPress={() => setShowFiltersModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Filtre Notes */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>{t('minimumRating')}</Text>
                <View style={styles.ratingFilterContainer}>
                  {[0, 3, 4, 4.5].map(rating => (
                    <TouchableOpacity
                      key={rating}
                      style={[
                        styles.ratingFilterButton,
                        filters.minRating === rating && styles.ratingFilterButtonActive
                      ]}
                      onPress={() => applyFilter('minRating', rating)}
                    >
                      <View style={styles.ratingDisplay}>
                        <Ionicons name="star" size={14} color="#FFC700" />
                        <Text style={styles.ratingFilterText}>
                          {rating === 0 ? 'Toutes' : `${rating}+`}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Filtre Ancienneté */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>{t('minimumExperience')}</Text>
                <View style={styles.experienceFilterContainer}>
                  {[0, 1, 3, 5, 10].map(years => (
                    <TouchableOpacity
                      key={years}
                      style={[
                        styles.experienceFilterButton,
                        filters.minExperience === years && styles.experienceFilterButtonActive
                      ]}
                      onPress={() => applyFilter('minExperience', years)}
                    >
                      <Text style={styles.experienceFilterText}>
                        {years === 0 ? 'Toutes' : `${years}+ ans`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Filtre Distance */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>{t('maximumDistance')}</Text>
                <View style={styles.distanceFilterContainer}>
                  <Text style={styles.distanceValue}>{filters.maxDistance} km</Text>
                  <View style={styles.distanceSliderContainer}>
                    {[10, 25, 50, 100].map(distance => (
                      <TouchableOpacity
                        key={distance}
                        style={[
                          styles.distanceButton,
                          filters.maxDistance === distance && styles.distanceButtonActive
                        ]}
                        onPress={() => applyFilter('maxDistance', distance)}
                      >
                        <Text style={styles.distanceButtonText}>{distance}km</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Options de tri */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>{t('sortBy')}</Text>
                <View style={styles.sortOptionsContainer}>
                  {[
                    { key: 'relevance', label: 'Pertinence', icon: 'search-outline' },
                    { key: 'rating', label: 'Meilleures notes', icon: 'star-outline' },
                    { key: 'distance', label: 'Distance', icon: 'location-outline' },
                    { key: 'experience', label: 'Expérience', icon: 'time-outline' }
                  ].map(option => (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.sortOption,
                        filters.sortBy === option.key && styles.sortOptionActive
                      ]}
                      onPress={() => applyFilter('sortBy', option.key)}
                    >
                      <Ionicons 
                        name={option.icon} 
                        size={20} 
                        color={filters.sortBy === option.key ? "#FFF" : "#666"} 
                      />
                      <Text style={[
                        styles.sortOptionText,
                        filters.sortBy === option.key && styles.sortOptionTextActive
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.filtersModalFooter}>
              <TouchableOpacity 
                style={styles.resetFiltersButton}
                onPress={resetFilters}
              >
                <Text style={styles.resetFiltersText}>{t('reset')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.applyFiltersButton}
                onPress={() => {
                  setShowFiltersModal(false);
                  handleSearch();
                }}
              >
                <Text style={styles.applyFiltersText}>{t('apply')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFC700',
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 50,
    resizeMode: 'contain',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
  },
  content: {
    flex: 1,
  },
  // Search Section Styles
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#F5F5F5',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  dropdown: {
    backgroundColor: '#FFF3CC',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  dropdownIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetIcon: {
    marginRight: 8,
    padding: 2,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  placeholderText: {
    color: '#999',
  },
  
  // Reset All Button
  resetAllButton: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#FFE0E0',
  },
  resetAllText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
    marginLeft: 8,
  },
  // Results Section
  resultsSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  resultCard: {
    marginBottom: 15,
  },
  resultCardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  resultProviderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#FFC700',
  },
  resultProviderInfo: {
    flex: 1,
  },
  resultProviderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  resultProviderSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  resultProviderCity: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  resultRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  resultRatingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginLeft: 2,
  },
  resultRatingCount: {
    fontSize: 10,
    color: '#666',
    marginLeft: 2,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 10,
  },
  modalHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalResetButton: {
    backgroundColor: '#FFE0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 15,
  },
  modalResetText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  bottomSpacing: {
    height: 120,
  },
  
  // Styles pour les suggestions
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  suggestionTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  suggestionSubtitle: {
    fontSize: 12,
    color: '#666',
  },

  // Styles pour les filtres intelligents
  intelligentFiltersScrollView: {
    marginTop: 10,
  },
  intelligentFiltersRow: {
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#FFE082',
    position: 'relative',
    marginRight: 10,
    minWidth: 80,
  },
  filterButtonActive: {
    backgroundColor: '#FFC700',
    borderColor: '#FFC700',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  filterActiveDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: '#FF4444',
    borderRadius: 4,
  },

  // Styles pour les suggestions IA
  aiSuggestionsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginTop: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E8F4FD',
  },
  aiSuggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  aiSuggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
  aiSuggestionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  aiSuggestionContent: {
    flex: 1,
  },
  aiSuggestionCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  aiSuggestionReason: {
    fontSize: 12,
    color: '#666',
  },
  confidenceContainer: {
    backgroundColor: '#E8F4FD',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2196F3',
  },

  // Styles pour le modal des filtres
  filtersModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  filterSection: {
    marginBottom: 25,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  
  // Filtres de notes
  ratingFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingFilterButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  ratingFilterButtonActive: {
    backgroundColor: '#FFC700',
    borderColor: '#FFC700',
  },
  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingFilterText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },

  // Filtres d'expérience
  experienceFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  experienceFilterButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 5,
    marginRight: 5,
  },
  experienceFilterButtonActive: {
    backgroundColor: '#FFC700',
    borderColor: '#FFC700',
  },
  experienceFilterText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  // Filtres de distance
  distanceFilterContainer: {
    alignItems: 'center',
  },
  distanceValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFC700',
    marginBottom: 15,
  },
  distanceSliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distanceButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  distanceButtonActive: {
    backgroundColor: '#FFC700',
    borderColor: '#FFC700',
  },
  distanceButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  // Options de tri
  sortOptionsContainer: {
    marginVertical: 5,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10,
  },
  sortOptionActive: {
    backgroundColor: '#FFC700',
    borderColor: '#FFC700',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    fontWeight: '500',
  },
  sortOptionTextActive: {
    color: '#FFFFFF',
  },

  // Footer du modal des filtres
  filtersModalFooter: {
    flexDirection: 'row',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  resetFiltersButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  resetFiltersText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  applyFiltersButton: {
    flex: 2,
    backgroundColor: '#FFC700',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  applyFiltersText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});