/**
 * Qibla Direction Finder
 * 
 * Optimized implementation for finding prayer direction (Qibla)
 * - Renders UI immediately (no blocking)
 * - Uses last known position for instant results
 * - Background location refinement
 * - Real-time compass heading
 * 
 * Features:
 * - Instant UI render with placeholders
 * - Fast location acquisition (last known → balanced accuracy)
 * - Qibla bearing calculation from user location
 * - Visual compass needle pointing to Qibla
 * - Optional city lookup (non-blocking)
 * - Permission handling with fallback
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DarkTheme, Spacing, Typography } from '../../constants/DarkTheme';
import { useLanguage } from '../../contexts/LanguageContext';

// Kaaba coordinates
const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

/**
 * Calculate initial bearing from point A to point B
 * Returns bearing in degrees (0-360)
 */
function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const toDegrees = (rad: number) => (rad * 180) / Math.PI;

  const dLon = toRadians(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRadians(lat2));
  const x =
    Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
    Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLon);

  let bearing = toDegrees(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;
  return bearing;
}

/**
 * Calculate distance to Kaaba in kilometers
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const toRadians = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function QiblaScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Location & Qibla state
  const [qiblaBearing, setQiblaBearing] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    city?: string;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  // Compass state
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [compassRotation] = useState(new Animated.Value(0));

  // UI state
  const [locatingInitial, setLocatingInitial] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [sensorAvailable, setSensorAvailable] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fast location acquisition with fallback chain:
   * 1. Last known position (instant)
   * 2. Current position with balanced accuracy (fast)
   * 3. Background city lookup (non-blocking)
   */
  const fetchLocation = useCallback(async (highAccuracy = false) => {
    try {
      if (highAccuracy) setRefreshing(true);

      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setPermissionDenied(true);
        setLocatingInitial(false);
        setRefreshing(false);
        return;
      }

      let coords: Location.LocationObjectCoords | null = null;

      // Try last known position first (instant)
      if (!highAccuracy) {
        const lastKnown = await Location.getLastKnownPositionAsync();
        if (lastKnown) {
          coords = lastKnown.coords;
        }
      }

      // If no last known, get current position
      if (!coords) {
        const location = await Location.getCurrentPositionAsync({
          accuracy: highAccuracy ? Location.Accuracy.High : Location.Accuracy.Balanced,
          timeInterval: highAccuracy ? undefined : 5000,
        });
        coords = location.coords;
      }

      const { latitude, longitude } = coords;

      // Calculate Qibla bearing and distance immediately
      const bearing = calculateBearing(latitude, longitude, KAABA_LAT, KAABA_LON);
      const dist = calculateDistance(latitude, longitude, KAABA_LAT, KAABA_LON);

      setQiblaBearing(bearing);
      setDistance(dist);
      setUserLocation({ latitude, longitude });
      setLocatingInitial(false);
      setRefreshing(false);

      // Background city lookup (non-blocking)
      setTimeout(async () => {
        try {
          const [geocode] = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });
          if (geocode) {
            setUserLocation((prev) =>
              prev
                ? {
                    ...prev,
                    city: geocode.city || geocode.region || geocode.country || undefined,
                  }
                : null
            );
          }
        } catch {
          // Silently fail - city name is optional
        }
      }, 100);
    } catch (error) {
      console.error('Error getting location:', error);
      setLocatingInitial(false);
      setRefreshing(false);
    }
  }, []);

  /**
   * Subscribe to location heading for device compass
   */
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let isMounted = true;

    const initHeading = async () => {
      try {
        // Subscribe to heading updates
        subscription = await Location.watchHeadingAsync((headingData) => {
          if (!isMounted) return;
          setDeviceHeading(headingData.magHeading);
        });
      } catch (error) {
        console.error('Error initializing heading:', error);
        if (isMounted) {
          setSensorAvailable(false);
        }
      }
    };

    initHeading();

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  /**
   * Fetch location on mount
   */
  useEffect(() => {
    fetchLocation(false);
  }, [fetchLocation]);

  /**
   * Animate compass needle rotation
   */
  useEffect(() => {
    if (qiblaBearing === null) return;

    // Calculate Qibla direction relative to device heading
    const qiblaRelative = (qiblaBearing - deviceHeading + 360) % 360;

    // Animate rotation
    Animated.spring(compassRotation, {
      toValue: qiblaRelative,
      useNativeDriver: true,
      speed: 12,
      bounciness: 0,
    }).start();
  }, [deviceHeading, qiblaBearing, compassRotation]);

  /**
   * Render permission denied state
   */
  if (permissionDenied) {
    return (
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#1A1625']}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('qibla.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.errorContainer}>
          <Ionicons name="location-outline" size={64} color={DarkTheme.textTertiary} />
          <Text style={styles.errorTitle}>{t('qibla.permissionRequired')}</Text>
          <Text style={styles.errorMessage}>{t('qibla.permissionMessage')}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setPermissionDenied(false);
              fetchLocation(false);
            }}
          >
            <Text style={styles.retryButtonText}>{t('qibla.enableLocation')}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  /**
   * Main Qibla compass view - Always render UI
   */
  const qiblaRelative = qiblaBearing !== null ? (qiblaBearing - deviceHeading + 360) % 360 : 0;

  return (
    <LinearGradient
      colors={['#0f172a', '#1e1b4b', '#1A1625']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('qibla.title')}</Text>
        <TouchableOpacity
          onPress={() => fetchLocation(true)}
          style={styles.refreshButton}
          disabled={refreshing}
          accessibilityRole="button"
          accessibilityLabel={t('qibla.refresh')}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color="#10b981" />
          ) : (
            <Ionicons name="refresh" size={20} color="#10b981" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Location Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color="#10b981" />
            <Text style={styles.infoText}>
              {locatingInitial
                ? t('qibla.locating')
                : userLocation?.city || t('qibla.yourLocation')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="navigate" size={16} color={DarkTheme.textSecondary} />
            <Text style={styles.infoText}>
              {distance !== null ? `${distance.toFixed(0)} km` : '— km'} {t('qibla.toKaaba')}
            </Text>
          </View>
        </View>

        {/* Compass Container */}
        <View style={styles.compassContainer}>
          {locatingInitial && (
            <View style={styles.compassOverlay}>
              <ActivityIndicator size="large" color="#10b981" />
              <Text style={styles.compassOverlayText}>{t('qibla.locating')}</Text>
            </View>
          )}

          {/* Outer Ring */}
          <View style={styles.compassRing}>
            {/* Cardinal directions */}
            <Text style={[styles.cardinalText, styles.cardinalN]}>N</Text>
            <Text style={[styles.cardinalText, styles.cardinalE]}>E</Text>
            <Text style={[styles.cardinalText, styles.cardinalS]}>S</Text>
            <Text style={[styles.cardinalText, styles.cardinalW]}>W</Text>

            {/* Degree markers */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <View
                key={deg}
                style={[
                  styles.degreeMarker,
                  {
                    transform: [{ rotate: `${deg}deg` }, { translateY: -110 }],
                  },
                ]}
              />
            ))}
          </View>

          {/* Qibla Needle */}
          {qiblaBearing !== null && (
            <Animated.View
              style={[
                styles.needleContainer,
                {
                  transform: [
                    {
                      rotate: compassRotation.interpolate({
                        inputRange: [0, 360],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.needle} />
              <View style={styles.needlePoint} />
            </Animated.View>
          )}

          {/* Center Kaaba Icon */}
          <View style={styles.centerIcon}>
            <Text style={styles.kaabaEmoji}>🕋</Text>
          </View>
        </View>

        {/* Bearing Info */}
        <View style={styles.bearingCard}>
          <View style={styles.bearingRow}>
            <View style={styles.bearingItem}>
              <Text style={styles.bearingLabel}>{t('qibla.facing')}</Text>
              <Text style={styles.bearingValue}>
                {locatingInitial ? '—' : Math.round(deviceHeading)}°
              </Text>
            </View>
            <View style={styles.bearingDivider} />
            <View style={styles.bearingItem}>
              <Text style={styles.bearingLabel}>{t('qibla.qibla')}</Text>
              <Text style={styles.bearingValue}>
                {qiblaBearing !== null ? Math.round(qiblaBearing) : '—'}°
              </Text>
            </View>
          </View>

          {!sensorAvailable && (
            <View style={styles.warningBanner}>
              <Ionicons name="warning-outline" size={16} color="#f59e0b" />
              <Text style={styles.warningText}>{t('qibla.noCompass')}</Text>
            </View>
          )}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>{t('qibla.howToUse')}</Text>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionBullet}>1.</Text>
            <Text style={styles.instructionText}>{t('qibla.instruction1')}</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionBullet}>2.</Text>
            <Text style={styles.instructionText}>{t('qibla.instruction2')}</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionBullet}>3.</Text>
            <Text style={styles.instructionText}>{t('qibla.instruction3')}</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  refreshButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  
  // Loading & Error States
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: 16,
    color: DarkTheme.textSecondary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.screenPadding * 2,
    gap: Spacing.md,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: Spacing.md,
    backgroundColor: '#10b981',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },

  // Info Card
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  infoText: {
    fontSize: 14,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightMedium,
  },

  // Compass
  compassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 280,
    marginVertical: Spacing.md,
    position: 'relative',
  },
  compassOverlay: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(26, 22, 37, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    gap: Spacing.sm,
  },
  compassOverlayText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
  },
  compassRing: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    position: 'relative',
  },
  cardinalText: {
    position: 'absolute',
    fontSize: 16,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textSecondary,
  },
  cardinalN: {
    top: 10,
    left: '50%',
    transform: [{ translateX: -8 }],
  },
  cardinalE: {
    right: 15,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  cardinalS: {
    bottom: 10,
    left: '50%',
    transform: [{ translateX: -8 }],
  },
  cardinalW: {
    left: 15,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  degreeMarker: {
    position: 'absolute',
    width: 2,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    top: '50%',
    left: '50%',
    marginLeft: -1,
  },
  needleContainer: {
    position: 'absolute',
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  needle: {
    width: 4,
    height: 90,
    backgroundColor: '#10b981',
    borderRadius: 2,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  needlePoint: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#10b981',
    marginTop: -2,
  },
  centerIcon: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: DarkTheme.cardBackground,
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kaabaEmoji: {
    fontSize: 24,
  },

  // Bearing Info
  bearingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  bearingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bearingItem: {
    flex: 1,
    alignItems: 'center',
  },
  bearingDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  bearingLabel: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    marginBottom: 4,
  },
  bearingValue: {
    fontSize: 24,
    fontWeight: Typography.weightBold,
    color: '#10b981',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 8,
    padding: Spacing.sm,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#f59e0b',
  },
  calibrationHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 8,
    padding: Spacing.sm,
  },
  calibrationText: {
    flex: 1,
    fontSize: 12,
    color: '#6366f1',
  },

  // Instructions
  instructionsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.xs,
  },
  instructionItem: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  instructionBullet: {
    fontSize: 12,
    fontWeight: Typography.weightMedium,
    color: '#10b981',
    width: 20,
  },
  instructionText: {
    flex: 1,
    fontSize: 12,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
});
