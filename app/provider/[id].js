import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../src/components/Header';
import LanguageToggle from '../../src/components/LanguageToggle';
import apiService from '../../src/services/apiService';

export default function ProviderProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [provider, setProvider] = useState(null);
  const [providerDetails, setProviderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState('apercu');

  useEffect(() => {
    loadProviderData();
  }, [id]);

  const loadProviderData = async () => {
    try {
      setLoading(true);
      // Get providers from home data
      let response = await apiService.getHomeData();
      let allProviders = response.data?.featuredProviders || [];
      
      // If no providers found, try search providers
      if (allProviders.length === 0) {
        response = await apiService.searchProviders({});
        allProviders = response.data || response || [];
      }
      
      // Ensure allProviders is an array
      if (!Array.isArray(allProviders)) {
        allProviders = [];
      }
      
      // Find provider by ID
      const foundProvider = allProviders.find(p => 
        p.user_id === parseInt(id) || 
        p.user_id === id || 
        p.user_id.toString() === id.toString()
      );
      
      if (foundProvider) {
        setProvider(foundProvider);
        
        // Load detailed provider info
        const localData = require('../../assets/data.json');
        const details = localData.providerDetails;
        if (details && details.user_id === foundProvider.user_id) {
          setProviderDetails(details);
        }
      } else {
        Alert.alert('Erreur', `Prestataire non trouvé (ID: ${id})`);
        router.back();
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    Alert.alert('Contact', 'Fonctionnalité de contact à implémenter');
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleWhatsApp = () => {
    Alert.alert('WhatsApp', 'Ouverture de WhatsApp...');
  };

  const handlePhone = () => {
    Alert.alert('Téléphone', 'Affichage du numéro de téléphone...');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvrez ${provider.name} - ${provider.specialty} sur Servuxi`,
        url: `servuxi://provider/${id}`,
      });
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={16} color="#FFC700" />);
    }
    
    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#FFC700" />);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFC700" />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  if (!provider) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
        <Text style={styles.errorText}>Prestataire non trouvé</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: false,
          title: provider?.name || 'Profil prestataire'
        }} 
      />
      
      {/* Shared Header */}
      <Header 
        showBackButton={true}
        showNotifications={false}
        customActions={
          <View style={styles.headerActions}>
            {/* Language Toggle */}
            <LanguageToggle />

            <TouchableOpacity 
              style={styles.notificationHeaderButton} 
              onPress={() => router.push('/notifications')}
              activeOpacity={0.8}
            >
              <Ionicons name="notifications-outline" size={24} color="#333" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.favoriteHeaderButton} 
              onPress={handleFavorite}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color="#333" 
              />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* Profile Image */}
          {!imageError ? (
            <Image 
              source={{ uri: provider.profile_picture_url }} 
              style={styles.profileImage}
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={[styles.profileImage, styles.defaultAvatar]}>
              <Text style={styles.avatarText}>
                {provider.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Text>
            </View>
          )}
          
          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <Text style={styles.providerName}>{provider.name}</Text>
            <Text style={styles.providerSpecialty}>{provider.specialty}</Text>
            
            {/* Rating */}
            <View style={styles.ratingRow}>
              <View style={styles.starsContainer}>
                {renderStars(provider.rating.average)}
              </View>
              <Text style={styles.ratingText}>
                {provider.rating.average.toFixed(1)} {provider.rating.count} avis
              </Text>
            </View>
          </View>
          
          {/* Action Icons Row */}
          <View style={styles.actionIconsRow}>
            <TouchableOpacity style={styles.actionIconButton}>
              <Ionicons name="calendar" size={24} color="#2196F3" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionIconButton}>
              <Ionicons name="chatbubble" size={24} color="#4CAF50" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionIconButton}>
              <Ionicons name="call" size={24} color="#FF9800" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Action Buttons */}
        <View style={styles.mainActionsContainer}>
          <TouchableOpacity style={styles.sendMessageButton} onPress={handleContact}>
            <Text style={styles.sendMessageText}>Envoyer Message</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
            <Ionicons name="logo-whatsapp" size={20} color="#FFF" />
            <Text style={styles.whatsappText}>WhatsApp</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.phoneButton} onPress={handlePhone}>
            <Ionicons name="call" size={20} color="#FFC700" />
            <Text style={styles.phoneText}>Voir Téléphone xxxx65</Text>
          </TouchableOpacity>
        </View>

        {/* Share Profile Button */}
        <View style={styles.shareProfileContainer}>
          <TouchableOpacity style={styles.shareProfileButton} onPress={handleShare}>
            <Ionicons name="share" size={20} color="#FFC700" />
            <Text style={styles.shareProfileText}>Partager le profil</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'apercu' && styles.activeTab]} 
            onPress={() => setActiveTab('apercu')}
          >
            <Text style={[styles.tabText, activeTab === 'apercu' && styles.activeTabText]}>
              Aperçu
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'portfolio' && styles.activeTab]} 
            onPress={() => setActiveTab('portfolio')}
          >
            <Text style={[styles.tabText, activeTab === 'portfolio' && styles.activeTabText]}>
              Portfolio
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'avis' && styles.activeTab]} 
            onPress={() => setActiveTab('avis')}
          >
            <Text style={[styles.tabText, activeTab === 'avis' && styles.activeTabText]}>
              Note / avis
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'apercu' && (
          <View style={styles.tabContent}>
            {/* Service Details */}
            <View style={styles.serviceDetailsContainer}>
              <Text style={styles.serviceTitle}>
                {providerDetails?.gigs?.[0]?.title || `${provider.specialty}`}
              </Text>
              
              <View style={styles.serviceTags}>
                <View style={styles.serviceTag}>
                  <Text style={styles.serviceTagText}>{provider.city}</Text>
                </View>
                <View style={styles.serviceTag}>
                  <Text style={styles.serviceTagText}>{providerDetails?.years_of_experience || provider.years_of_experience}</Text>
                </View>
                <View style={styles.serviceTag}>
                  <Text style={styles.serviceTagText}>1 878 vues</Text>
                </View>
                {providerDetails?.is_verified && (
                  <View style={styles.serviceTag}>
                    <Text style={styles.serviceTagText}>✓ Vérifié</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.serviceDescription}>
                {providerDetails?.bio || provider.bio_snippet || `${provider.specialty} professionnel agréé avec plus de ${provider.anciennete || 8} ans d'expérience dans l'installation, la réparation et la maintenance. Je propose des services complets pour particuliers et professionnels.`}
              </Text>
              
              <Text style={styles.publicationInfo}>
                {providerDetails?.address || 'Hay rah rah Razidat sanaa 3'}{'\n'}
                Publié le 10 Nov 2024 · Modifié le 22 Nov 2024
              </Text>
            </View>

            {/* Provider Information */}
            <View style={styles.providerInfoContainer}>
              <Text style={styles.sectionTitle}>Informations du prestataire</Text>
              
              {/* Contact Information */}
              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>Contact</Text>
                <View style={styles.infoRow}>
                  <Ionicons name="call" size={16} color="#666" />
                  <Text style={styles.infoText}>{providerDetails?.contact?.phone || 'Non renseigné'}</Text>
                </View>
                {providerDetails?.contact?.fixed_phone && (
                  <View style={styles.infoRow}>
                    <Ionicons name="call" size={16} color="#666" />
                    <Text style={styles.infoText}>{providerDetails.contact.fixed_phone} (Fixe)</Text>
                  </View>
                )}
                <View style={styles.infoRow}>
                  <Ionicons name="mail" size={16} color="#666" />
                  <Text style={styles.infoText}>{providerDetails?.contact?.email || 'Non renseigné'}</Text>
                </View>
                {providerDetails?.contact?.website && (
                  <View style={styles.infoRow}>
                    <Ionicons name="globe" size={16} color="#666" />
                    <Text style={styles.infoText}>Site web disponible</Text>
                  </View>
                )}
              </View>

              {/* Professional Information */}
              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>Informations professionnelles</Text>
                <View style={styles.infoRow}>
                  <Ionicons name="business" size={16} color="#666" />
                  <Text style={styles.infoText}>
                    {providerDetails?.main_category?.name || 'Non renseigné'}
                  </Text>
                </View>
                {providerDetails?.sub_categories && (
                  <View style={styles.infoRow}>
                    <Ionicons name="list" size={16} color="#666" />
                    <Text style={styles.infoText}>
                      {providerDetails.sub_categories.map(cat => cat.name).join(', ')}
                    </Text>
                  </View>
                )}
                {providerDetails?.date_of_birth && (
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar" size={16} color="#666" />
                    <Text style={styles.infoText}>
                      Né(e) le {new Date(providerDetails.date_of_birth).toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                )}
              </View>

              {/* Local/Boutique Information */}
              {providerDetails?.local_boutique?.has_local && (
                <View style={styles.infoSection}>
                  <Text style={styles.infoSectionTitle}>Local / Boutique</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="storefront" size={16} color="#666" />
                    <Text style={styles.infoText}>{providerDetails.local_boutique.name}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="location" size={16} color="#666" />
                    <Text style={styles.infoText}>{providerDetails.local_boutique.address}</Text>
                  </View>
                  <Text style={styles.infoDescription}>
                    {providerDetails.local_boutique.description}
                  </Text>
                </View>
              )}

              {/* Business Card */}
              {providerDetails?.business_card_url && (
                <View style={styles.infoSection}>
                  <Text style={styles.infoSectionTitle}>Carte de visite</Text>
                  <Image 
                    source={{ uri: providerDetails.business_card_url }}
                    style={styles.businessCardImage}
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>
          </View>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <View style={styles.tabContent}>
            <View style={styles.portfolioContainer}>
              <Text style={styles.sectionTitle}>Portfolio professionnel</Text>
              <Text style={styles.portfolioDescription}>
                Découvrez quelques-unes de mes réalisations récentes
              </Text>
              {providerDetails?.portfolio ? (
                <View style={styles.portfolioGrid}>
                  {providerDetails.portfolio.map((imageUrl, index) => (
                    <TouchableOpacity key={index} style={styles.portfolioItem} activeOpacity={0.8}>
                      <Image 
                        source={{ uri: imageUrl }} 
                        style={styles.portfolioImage}
                        resizeMode="cover"
                      />
                      <View style={styles.portfolioOverlay}>
                        <Ionicons name="eye" size={20} color="#FFF" />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.noDataText}>Aucun élément de portfolio disponible</Text>
              )}
            </View>

            {/* Business Card in Portfolio Tab */}
            {providerDetails?.business_card_url && (
              <View style={styles.businessCardContainer}>
                <Text style={styles.sectionTitle}>Carte de visite professionnelle</Text>
                <TouchableOpacity style={styles.businessCardWrapper} activeOpacity={0.8}>
                  <Image 
                    source={{ uri: providerDetails.business_card_url }}
                    style={styles.businessCardImageLarge}
                    resizeMode="contain"
                  />
                  <View style={styles.businessCardOverlay}>
                    <Ionicons name="download" size={20} color="#FFF" />
                    <Text style={styles.businessCardText}>Télécharger</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Reviews Tab */}
        {activeTab === 'avis' && (
          <View style={styles.tabContent}>
            <View style={styles.reviewsContainer}>
              <Text style={styles.reviewsTitle}>
                Avis clients ({providerDetails?.rating?.count || provider.rating.count} avis)
              </Text>
              
              {providerDetails?.reviews ? (
                providerDetails.reviews.map((review, index) => (
                  <View key={index} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewerInfo}>
                        <View style={styles.reviewerAvatar}>
                          <Text style={styles.reviewerInitials}>
                            {review.client_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.reviewerDetails}>
                          <Text style={styles.reviewerName}>{review.client_name}</Text>
                          <View style={styles.reviewStars}>
                            {renderStars(review.rating)}
                          </View>
                        </View>
                      </View>
                      <Text style={styles.reviewDate}>
                        {new Date(review.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </Text>
                    </View>
                    <Text style={styles.reviewText}>{review.comment}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>Aucun avis disponible</Text>
              )}
            </View>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF6B6B',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#FFC700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Header Actions
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationHeaderButton: {
    padding: 8,
    position: 'relative',
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
  favoriteHeaderButton: {
    padding: 8,
    marginLeft: 8,
  },
  
  // Content Styles
  scrollView: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#FFF',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  defaultAvatar: {
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#666',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  providerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  providerSpecialty: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
  },
  actionIconsRow: {
    flexDirection: 'row',
    gap: 30,
  },
  actionIconButton: {
    padding: 8,
  },
  
  // Main Actions
  mainActionsContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  sendMessageButton: {
    backgroundColor: '#FFC700',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 12,
  },
  sendMessageText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 12,
  },
  whatsappText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  phoneButton: {
    borderWidth: 2,
    borderColor: '#FFC700',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
  },
  phoneText: {
    color: '#FFC700',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Share Profile Button
  shareProfileContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  shareProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FFC700',
    borderRadius: 25,
    backgroundColor: '#FFF',
  },
  shareProfileText: {
    color: '#FFC700',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Tab Navigation
  tabContainer: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    marginHorizontal: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  activeTab: {
    backgroundColor: '#FFC700',
    shadowColor: '#FFC700',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  tabContent: {
    backgroundColor: '#F8F9FA',
    minHeight: 400,
  },
  
  // Service Details
  serviceDetailsContainer: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  serviceTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  serviceTag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceTagText: {
    fontSize: 14,
    color: '#666',
  },
  serviceDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  publicationInfo: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  
  // Reviews
  reviewsContainer: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reviewerInitials: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reviewStars: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 14,
    color: '#999',
  },
  reviewText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  
  // Portfolio
  portfolioContainer: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  portfolioDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  portfolioItem: {
    width: '48%',
    marginBottom: 16,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  portfolioImage: {
    width: '100%',
    height: 120,
  },
  portfolioOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
  
  // Provider Information
  providerInfoContainer: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  infoDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
    marginLeft: 24,
  },
  businessCardImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
  
  // Enhanced Business Card (in Portfolio)
  businessCardContainer: {
    backgroundColor: '#FFF',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  businessCardWrapper: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  businessCardImageLarge: {
    width: '100%',
    height: 250,
  },
  businessCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  businessCardText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
