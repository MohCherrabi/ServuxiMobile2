import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const logo = require('../../assets/images/servuxiLogo.png');

export default function Header({ 
  title = null, 
  showBackButton = true, 
  showNotifications = false,
  onNotificationPress,
  customActions = null,
  variant = 'default' // 'default', 'auth', 'tabs'
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      router.push('/notifications');
    }
  };

  const isAuthVariant = variant === 'auth';
  const paddingTop = isAuthVariant ? Math.max(insets.top, 20) + 15 : insets.top + 10;
  const paddingBottom = isAuthVariant ? 30 : 15;

  return (
    <View style={[
      styles.header, 
      { 
        paddingTop,
        paddingBottom,
        minHeight: isAuthVariant ? 100 : 'auto',
        marginBottom: isAuthVariant ? -10 : 0
      }
    ]}>
      {/* Bouton retour ou espace */}
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity 
            style={[
              styles.backButton,
              isAuthVariant && styles.authBackButton
            ]} 
            onPress={() => router.back()}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={isAuthVariant ? "#333" : "#FFFFFF"} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Logo ou titre au centre */}
      <View style={styles.centerContainer}>
        {title ? (
          <Text style={styles.titleText}>{title}</Text>
        ) : (
          <Image source={logo} style={styles.logo} />
        )}
      </View>
      
      {/* Actions à droite */}
      <View style={styles.rightContainer}>
        {customActions ? (
          customActions
        ) : showNotifications ? (
          <TouchableOpacity 
            style={styles.notificationButton} 
            onPress={handleNotificationPress}
            activeOpacity={0.8}
          >
            <Ionicons name="notifications-outline" size={24} color="#333" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    overflow: 'hidden',
    zIndex: 1,
  },
  leftContainer: {
    width: 50,
    alignItems: 'flex-start',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authBackButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    padding: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 50,
    resizeMode: 'contain',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  rightContainer: {
    width: 50,
    alignItems: 'flex-end',
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
});
