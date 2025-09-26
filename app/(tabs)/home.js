import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePermissions } from '../../src/hooks/usePermissions';

const logo = require('../../assets/images/servuxiLogo.png');
const data = require('../../assets/data.json');

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isClient, isProvider, canBrowseServices } = usePermissions();

  // États pour les données - EN ATTENTE DE VOS APIs
  const [popularServices, setPopularServices] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [basedOnHistory, setBasedOnHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Appeler vos APIs ici quand elles seront prêtes
    loadDataFromAPIs();
  }, []);

  const loadDataFromAPIs = async () => {
    setLoading(true);
    try {
      // Simulation d'appels API avec les données JSON
      // TODO: Remplacer par vos vrais appels d'API plus tard
      
      // Services populaires
      setPopularServices(data.homeScreen.popularServices);
      
      // Prestataires récemment ajoutés (utilise les featured providers)
      setRecentlyAdded(data.homeScreen.featuredProviders);
      
      // Basé sur l'historique (utilise les mêmes providers pour la démo)
      setBasedOnHistory(data.homeScreen.featuredProviders);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  // TODO: Fonctions à connecter avec vos APIs quand elles seront prêtes
  const handleServicePress = (service) => {
    console.log('Service selected:', service);
    router.push(`/search?category=${service.id}`);
  };

  const handleProviderPress = (provider) => {
    console.log('Provider selected:', provider);
    router.push(`/provider/${provider.id}`);
  };

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  const handleOffersPress = () => {
    router.push('/offers');
  };

  return (
    <View style={styles.container}>
      {/* Header personnalisé */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        
        <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Section Utilisations des offres */}
        <TouchableOpacity 
          style={styles.offersButton} 
          onPress={handleOffersPress}
          activeOpacity={0.8}
        >
          <View style={styles.offersButtonContent}>
            <View style={styles.offersIconContainer}>
              <Ionicons name="gift" size={24} color="#FFC700" />
            </View>
            <Text style={styles.offersButtonText}>Utilisations des offres</Text>
            <View style={styles.offersArrowContainer}>
              <Ionicons name="chevron-forward" size={20} color="#FFF" />
            </View>
          </View>
          <View style={styles.offersButtonGlow} />
        </TouchableOpacity>

        {/* Section Services populaires */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Services populaires</Text>
            <Text style={styles.seeAllText}>Tout voir</Text>
          </View>
          
          {popularServices.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>En attente des données API...</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {popularServices.map((service, index) => (
                <View key={`service-wrapper-${service.category_id}-${index}`} style={styles.serviceCardWrapper}>
                  <TouchableOpacity
                    key={`service-${service.category_id}-${index}`}
                    style={styles.serviceCard}
                    onPress={() => handleServicePress(service)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.serviceIconContainer}>
                      <Image 
                        source={{ uri: service.icon_url }} 
                        style={styles.serviceIcon}
                        onError={() => console.log('Icon failed to load:', service.icon_url)}
                        defaultSource={require('../../assets/images/servuxiLogo.png')}
                      />
                    </View>
                    <Text style={styles.serviceName}>{service.name}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Section Récemment ajoutées */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Récemment ajoutées</Text>
            <Text style={styles.seeAllText}>Tout voir</Text>
          </View>
          
          {recentlyAdded.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>En attente des données API...</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentlyAdded.map((provider, index) => (
                <View key={`recent-wrapper-${provider.user_id}-${index}`} style={styles.providerCardWrapper}>
                  <TouchableOpacity
                    key={`recent-${provider.user_id}-${index}`}
                    style={styles.providerCard}
                    onPress={() => handleProviderPress(provider)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: provider.profile_picture_url }} style={styles.providerImage} />
                    <View style={styles.providerInfo}>
                      <Text style={styles.providerName}>{provider.name}</Text>
                      <Text style={styles.providerSpecialty}>{provider.specialty}</Text>
                      <Text style={styles.providerCity}>{provider.city}</Text>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#FFC700" />
                        <Text style={styles.ratingText}>{provider.rating.average}</Text>
                        <Text style={styles.ratingCount}>({provider.rating.count})</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Section Inspiré par votre historique - VIDE EN ATTENTE API */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Les prestataires disponibles</Text>
            <Text style={styles.seeAllText}>Tout voir</Text>
          </View>
          
          {basedOnHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>En attente des données API...</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {basedOnHistory.map((provider, index) => (
                <View key={`history-wrapper-${provider.user_id}-${index}`} style={styles.providerCardWrapper}>
                  <TouchableOpacity
                    key={`history-${provider.user_id}-${index}`}
                    style={styles.providerCard}
                    onPress={() => handleProviderPress(provider)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: provider.profile_picture_url }} style={styles.providerImage} />
                    <View style={styles.providerInfo}>
                      <Text style={styles.providerName}>{provider.name}</Text>
                      <Text style={styles.providerSpecialty}>{provider.specialty}</Text>
                      <Text style={styles.providerCity}>{provider.city}</Text>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#FFC700" />
                        <Text style={styles.ratingText}>{provider.rating.average}</Text>
                        <Text style={styles.ratingCount}>({provider.rating.count})</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  offersButton: {
    marginHorizontal: 20,
    marginVertical: 15,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 15,
  },
  offersButtonContent: {
    backgroundColor: '#4A5568',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 2,
  },
  offersIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 199, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFC700',
  },
  offersButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 15,
  },
  offersArrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offersButtonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 199, 0, 0.1)',
    borderRadius: 20,
    zIndex: 1,
  },
  section: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#FFC700',
    fontWeight: '600',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 120,
  },
  // Card wrapper styles
  serviceCardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 15,
    overflow: 'hidden',
    width: 110,
    height: 140,
  },
  providerCardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 15,
    overflow: 'hidden',
    width: 220,
    minHeight: 180,
  },
  // Service card styles
  serviceCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    width: 110,
    height: 140,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFC700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#FFC700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  serviceIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  serviceName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    lineHeight: 18,
  },
  // Provider card styles
  providerCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    width: 220,
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  providerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#FFC700',
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  providerSpecialty: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  providerCity: {
    fontSize: 13,
    color: '#999',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});