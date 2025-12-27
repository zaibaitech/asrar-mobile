/**
 * Location Service
 * ================
 * Auto-detect user location for prayer times and accurate astrological calculations
 * 
 * Uses expo-location for GPS and reverse geocoding
 */

import { UserLocation } from '@/types/user-profile';
import * as Location from 'expo-location';

// ============================================================================
// LOCATION DETECTION
// ============================================================================

export interface LocationPermissionResult {
  granted: boolean;
  canAskAgain: boolean;
}

/**
 * Request location permissions
 */
export async function requestLocationPermission(): Promise<LocationPermissionResult> {
  try {
    const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
    
    return {
      granted: status === 'granted',
      canAskAgain,
    };
    
  } catch (error) {
    if (__DEV__) {
      console.error('[LocationService] Permission error:', error);
    }
    
    return {
      granted: false,
      canAskAgain: false,
    };
  }
}

/**
 * Check if location permissions are granted
 */
export async function checkLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    if (__DEV__) {
      console.error('[LocationService] Permission check error:', error);
    }
    return false;
  }
}

/**
 * Get current location with reverse geocoding
 */
export async function getCurrentLocation(): Promise<{
  location: UserLocation | null;
  error: string | null;
}> {
  try {
    // Check permission
    const hasPermission = await checkLocationPermission();
    
    if (!hasPermission) {
      return {
        location: null,
        error: 'Location permission not granted',
      };
    }
    
    // Get current position
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    
    // Reverse geocode to get address
    const addresses = await Location.reverseGeocodeAsync({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    
    const address = addresses[0];
    
    // Build location label
    let label = 'Current Location';
    if (address) {
      if (address.city && address.country) {
        label = `${address.city}, ${address.country}`;
      } else if (address.region && address.country) {
        label = `${address.region}, ${address.country}`;
      } else if (address.country) {
        label = address.country;
      }
    }
    
    const userLocation: UserLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      label,
    };
    
    return {
      location: userLocation,
      error: null,
    };
    
  } catch (error) {
    if (__DEV__) {
      console.error('[LocationService] Get location error:', error);
    }
    
    return {
      location: null,
      error: error instanceof Error ? error.message : 'Failed to get location',
    };
  }
}

/**
 * Get location from coordinates (reverse geocode only)
 */
export async function geocodeLocation(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    const addresses = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    
    const address = addresses[0];
    
    if (address) {
      if (address.city && address.country) {
        return `${address.city}, ${address.country}`;
      } else if (address.region && address.country) {
        return `${address.region}, ${address.country}`;
      } else if (address.country) {
        return address.country;
      }
    }
    
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[LocationService] Geocode error:', error);
    }
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
}

/**
 * Calculate distance between two coordinates (in kilometers)
 * Uses Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  
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

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Get timezone from coordinates
 * Note: This is approximate - uses device timezone as fallback
 */
export async function getTimezoneFromLocation(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    // In production, use a timezone API service like:
    // - TimeZoneDB API
    // - Google Maps Time Zone API
    // - GeoNames API
    
    // For now, return device timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    return timezone;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[LocationService] Timezone error:', error);
    }
    return 'UTC';
  }
}
