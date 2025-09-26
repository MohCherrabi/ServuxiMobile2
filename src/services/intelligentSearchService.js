// Service de Recherche Intelligente avec IA

class IntelligentSearchService {
  constructor() {
    this.searchHistory = [];
    this.categoryKeywords = {
      'Santé': ['médecin', 'docteur', 'santé', 'maladie', 'consultation', 'urgence', 'hôpital', 'clinique', 'pédiatre', 'cardiologue'],
      'Travaux & Services à Domicile': ['plombier', 'électricien', 'peintre', 'rénovation', 'construction', 'maison', 'dépannage', 'installation'],
      'Droit & Justice': ['avocat', 'juridique', 'droit', 'justice', 'conseil', 'tribunal', 'contrat', 'divorce'],
      'Education': ['professeur', 'cours', 'soutien', 'école', 'formation', 'enseignement', 'mathématiques', 'français'],
      'Technologie': ['développeur', 'informatique', 'site web', 'application', 'programmation', 'design', 'graphique'],
      'Beauté & Bien-être': ['coiffeur', 'esthéticienne', 'massage', 'beauté', 'spa', 'manucure', 'soins'],
      'Transport': ['chauffeur', 'taxi', 'livraison', 'déménagement', 'transport', 'véhicule']
    };
  }

  // Analyse intelligente des mots-clés
  analyzeSearchText(searchText) {
    const keywords = searchText.toLowerCase().split(' ').filter(word => word.length > 2);
    const suggestions = [];
    
    // Recherche par mots-clés dans les catégories
    Object.entries(this.categoryKeywords).forEach(([category, categoryWords]) => {
      const matchScore = keywords.reduce((score, keyword) => {
        const matches = categoryWords.filter(word => 
          word.includes(keyword) || keyword.includes(word)
        ).length;
        return score + matches;
      }, 0);
      
      if (matchScore > 0) {
        suggestions.push({
          category,
          score: matchScore,
          matchedKeywords: keywords.filter(keyword => 
            categoryWords.some(word => word.includes(keyword) || keyword.includes(word))
          )
        });
      }
    });

    // Trier par score de pertinence
    return suggestions.sort((a, b) => b.score - a.score);
  }

  // Suggestions intelligentes de catégories
  getSmartCategorySuggestions(searchText, userHistory = []) {
    const analysis = this.analyzeSearchText(searchText);
    const suggestions = [];

    // Suggestions basées sur l'analyse des mots-clés
    analysis.slice(0, 3).forEach(suggestion => {
      suggestions.push({
        type: 'keyword_match',
        category: suggestion.category,
        reason: `Correspond aux mots: ${suggestion.matchedKeywords.join(', ')}`,
        confidence: Math.min(suggestion.score * 25, 95) // Score de confiance
      });
    });

    // Suggestions basées sur l'historique utilisateur
    if (userHistory.length > 0) {
      const historyCategories = this.getPopularCategoriesFromHistory(userHistory);
      historyCategories.forEach(cat => {
        if (!suggestions.find(s => s.category === cat.category)) {
          suggestions.push({
            type: 'history_based',
            category: cat.category,
            reason: 'Basé sur vos recherches récentes',
            confidence: cat.popularity * 20
          });
        }
      });
    }

    // Suggestions tendances (simulé avec IA)
    const trendingSuggestions = this.getTrendingSuggestions(searchText);
    trendingSuggestions.forEach(trend => {
      if (!suggestions.find(s => s.category === trend.category)) {
        suggestions.push(trend);
      }
    });

    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  }

  // Suggestions tendances simulées (IA)
  getTrendingSuggestions(searchText) {
    const trending = [
      { category: 'Santé', reason: 'Très demandé cette semaine', confidence: 80 },
      { category: 'Travaux & Services à Domicile', reason: 'Populaire dans votre région', confidence: 75 },
      { category: 'Technologie', reason: 'Tendance actuelle', confidence: 70 }
    ];

    return trending.map(trend => ({
      ...trend,
      type: 'ai_trending'
    }));
  }

  // Analyser l'historique pour les catégories populaires
  getPopularCategoriesFromHistory(history) {
    const categoryCount = {};
    
    history.forEach(search => {
      const category = search.category || 'Général';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    return Object.entries(categoryCount)
      .map(([category, count]) => ({
        category,
        popularity: count / history.length
      }))
      .sort((a, b) => b.popularity - a.popularity);
  }

  // Filtrage avancé des résultats
  applyIntelligentFilters(providers, filters) {
    let filteredProviders = [...providers];

    // Filtre par notes
    if (filters.minRating && filters.minRating > 0) {
      filteredProviders = filteredProviders.filter(provider => 
        provider.rating?.average >= filters.minRating
      );
    }

    // Filtre par ancienneté/expérience
    if (filters.minExperience && filters.minExperience > 0) {
      filteredProviders = filteredProviders.filter(provider => {
        // Try to use the direct anciennete field first
        if (provider.anciennete && typeof provider.anciennete === 'number') {
          return provider.anciennete >= filters.minExperience;
        }
        
        // Fallback to extracting from text
        const experience = this.extractExperienceYears(provider.years_of_experience || provider.bio_snippet);
        return experience >= filters.minExperience;
      });
    }

    // Filtre par distance (simulé)
    if (filters.maxDistance && filters.userLocation) {
      filteredProviders = filteredProviders.filter(provider => {
        const distance = this.calculateDistance(filters.userLocation, provider.city);
        return distance <= filters.maxDistance;
      });
    }

    // Filtre par disponibilité
    if (filters.availableNow) {
      filteredProviders = filteredProviders.filter(provider => 
        this.isProviderAvailable(provider)
      );
    }

    // Tri intelligent par pertinence
    return this.sortByRelevance(filteredProviders, filters.searchText);
  }

  // Extraire les années d'expérience du texte
  extractExperienceYears(text) {
    if (!text) return 0;
    
    const patterns = [
      /(\d+)\s*ans?\s*d['\s]*expérience/i,
      /(\d+)\+?\s*années?/i,
      /plus\s*de\s*(\d+)\s*ans?/i,
      /(\d+)\s*years?/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return parseInt(match[1], 10);
      }
    }

    return 0;
  }

  // Calculer la distance (simulé - remplacer par vraie géolocalisation)
  calculateDistance(userLocation, providerCity) {
    // Simulation simple - remplacer par vraie calculation GPS
    const distances = {
      'Casablanca': { 'Rabat': 87, 'Marrakech': 240, 'Fès': 300 },
      'Rabat': { 'Casablanca': 87, 'Marrakech': 327, 'Fès': 210 },
      'Marrakech': { 'Casablanca': 240, 'Rabat': 327, 'Fès': 530 }
    };

    return distances[userLocation]?.[providerCity] || Math.random() * 100;
  }

  // Vérifier la disponibilité (simulé)
  isProviderAvailable(provider) {
    // Simulation - remplacer par vraie API de disponibilité
    const now = new Date();
    const hour = now.getHours();
    
    // Simuler la disponibilité selon les heures de travail
    if (provider.working_hours) {
      const today = now.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();
      const todayHours = provider.working_hours[today];
      
      if (todayHours && todayHours !== 'Fermé') {
        const [start, end] = todayHours.split(' - ').map(time => {
          const [h] = time.split(':').map(Number);
          return h;
        });
        return hour >= start && hour <= end;
      }
    }

    // Disponibilité par défaut (70% de chance)
    return Math.random() > 0.3;
  }

  // Tri par pertinence intelligent
  sortByRelevance(providers, searchText) {
    if (!searchText) return providers;

    const searchLower = searchText.toLowerCase().trim();
    
    // Filter providers first to only include relevant matches
    const relevantProviders = providers.filter(provider => {
      return this.isRelevantMatch(provider, searchLower);
    });

    return relevantProviders.sort((a, b) => {
      let scoreA = this.calculateRelevanceScore(a, searchLower);
      let scoreB = this.calculateRelevanceScore(b, searchLower);

      return scoreB - scoreA;
    });
  }

  // Check if provider is relevant to search
  isRelevantMatch(provider, searchLower) {
    if (searchLower.length < 3) {
      // For short searches, only match if it starts with the search term
      return (
        provider.name.toLowerCase().startsWith(searchLower) ||
        provider.specialty?.toLowerCase().startsWith(searchLower) ||
        provider.keywords?.some(keyword => keyword.toLowerCase().startsWith(searchLower))
      );
    }

    // For longer searches, be more flexible but still precise
    const exactMatch = (
      provider.name.toLowerCase().includes(searchLower) ||
      provider.specialty?.toLowerCase().includes(searchLower) ||
      provider.category?.toLowerCase().includes(searchLower)
    );

    // Check keywords for whole word matches
    const keywordMatch = provider.keywords?.some(keyword => {
      const keywordLower = keyword.toLowerCase();
      return (
        keywordLower === searchLower || // Exact match
        keywordLower.startsWith(searchLower) || // Starts with
        (searchLower.length >= 4 && keywordLower.includes(searchLower)) // Contains (only for 4+ chars)
      );
    });

    return exactMatch || keywordMatch;
  }

  // Calculate relevance score
  calculateRelevanceScore(provider, searchLower) {
    let score = 0;

    // Exact name match gets highest score
    if (provider.name.toLowerCase() === searchLower) score += 50;
    else if (provider.name.toLowerCase().startsWith(searchLower)) score += 30;
    else if (provider.name.toLowerCase().includes(searchLower)) score += 15;

    // Exact specialty match
    if (provider.specialty?.toLowerCase() === searchLower) score += 40;
    else if (provider.specialty?.toLowerCase().startsWith(searchLower)) score += 25;
    else if (provider.specialty?.toLowerCase().includes(searchLower)) score += 12;

    // Category match
    if (provider.category?.toLowerCase() === searchLower) score += 35;
    else if (provider.category?.toLowerCase().includes(searchLower)) score += 10;

    // Keywords match (precise matching)
    if (provider.keywords) {
      provider.keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        if (keywordLower === searchLower) score += 30;
        else if (keywordLower.startsWith(searchLower)) score += 20;
        else if (searchLower.length >= 4 && keywordLower.includes(searchLower)) score += 8;
      });
    }

    // Boost score based on rating
    score += (provider.rating?.average || 0) * 2;

    // Boost score based on review count
    score += Math.min((provider.rating?.count || 0) / 20, 3);

    // Boost if verified
    if (provider.is_verified) score += 2;

    return score;
  }

  // Enregistrer la recherche dans l'historique
  saveSearchToHistory(searchParams, results) {
    const searchEntry = {
      ...searchParams,
      timestamp: new Date().toISOString(),
      resultsCount: results.length
    };

    this.searchHistory.unshift(searchEntry);
    
    // Garder seulement les 50 dernières recherches
    if (this.searchHistory.length > 50) {
      this.searchHistory = this.searchHistory.slice(0, 50);
    }

    // TODO: Sauvegarder dans le stockage local ou l'API
    return searchEntry;
  }

  // Obtenir des suggestions de recherche
  getSearchSuggestions(currentText) {
    const suggestions = [];

    // Suggestions basées sur l'historique
    this.searchHistory
      .filter(search => search.text?.toLowerCase().includes(currentText.toLowerCase()))
      .slice(0, 3)
      .forEach(search => {
        suggestions.push({
          type: 'history',
          text: search.text,
          subtitle: 'Recherche récente'
        });
      });

    // Suggestions populaires
    const popularSearches = [
      'Médecin généraliste',
      'Plombier urgence',
      'Avocat divorce',
      'Professeur mathématiques',
      'Électricien dépannage'
    ];

    popularSearches
      .filter(search => search.toLowerCase().includes(currentText.toLowerCase()))
      .slice(0, 2)
      .forEach(search => {
        if (!suggestions.find(s => s.text === search)) {
          suggestions.push({
            type: 'popular',
            text: search,
            subtitle: 'Recherche populaire'
          });
        }
      });

    return suggestions;
  }
}

// Export singleton instance
export const intelligentSearchService = new IntelligentSearchService();
export default intelligentSearchService;
