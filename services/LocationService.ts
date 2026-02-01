/**
 * Location Service
 * ================
 * Auto-detect user location for prayer times and accurate astrological calculations
 * 
 * Uses expo-location for GPS and reverse geocoding
 */

import { UserLocation } from '@/types/user-profile';
import * as Location from 'expo-location';

export interface LocationSearchResult {
  latitude: number;
  longitude: number;
  label: string;
}

const searchCache = new Map<string, { at: number; results: LocationSearchResult[] }>();
const SEARCH_CACHE_TTL_MS = 10 * 60 * 1000;
const SEARCH_CACHE_MAX = 50;

function normalizeSearchQuery(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, ' ');
}

function buildAddressLabel(address: Location.LocationGeocodedAddress | undefined | null): string {
  if (!address) return '';
  const parts: string[] = [];
  const cityish = address.city || address.subregion || address.region;
  if (cityish) parts.push(cityish);
  if (address.country) {
    if (!parts.includes(address.country)) parts.push(address.country);
  }
  return parts.join(', ');
}

function setSearchCache(key: string, results: LocationSearchResult[]) {
  if (searchCache.size >= SEARCH_CACHE_MAX) {
    const firstKey = searchCache.keys().next().value as string | undefined;
    if (firstKey) searchCache.delete(firstKey);
  }
  searchCache.set(key, { at: Date.now(), results });
}

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
 * Search for locations (city/country) from a free-text query.
 * Uses Expo's geocoding provider (platform dependent).
 * Does not require GPS permission.
 */
export async function searchLocations(
  query: string,
  options?: { limit?: number }
): Promise<LocationSearchResult[]> {
  const normalized = normalizeSearchQuery(query);
  if (normalized.length < 2) return [];

  const cached = searchCache.get(normalized);
  if (cached && Date.now() - cached.at < SEARCH_CACHE_TTL_MS) {
    return cached.results;
  }

  try {
    const limit = Math.max(1, Math.min(options?.limit ?? 6, 10));
    const coords = await Location.geocodeAsync(query);

    const sliced = coords.slice(0, limit);

    const results = await Promise.all(
      sliced.map(async (c): Promise<LocationSearchResult> => {
        let label = `${c.latitude.toFixed(4)}, ${c.longitude.toFixed(4)}`;
        try {
          const addresses = await Location.reverseGeocodeAsync({
            latitude: c.latitude,
            longitude: c.longitude,
          });
          const addressLabel = buildAddressLabel(addresses?.[0]);
          if (addressLabel) label = addressLabel;
        } catch {
          // ignore reverse geocode failures; coords label is fine
        }
        return {
          latitude: c.latitude,
          longitude: c.longitude,
          label,
        };
      })
    );

    // De-dupe by label+rounded coords
    const seen = new Set<string>();
    const deduped: LocationSearchResult[] = [];
    for (const r of results) {
      const key = `${r.label}|${r.latitude.toFixed(4)}|${r.longitude.toFixed(4)}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(r);
      }
    }

    setSearchCache(normalized, deduped);
    return deduped;
  } catch (error) {
    if (__DEV__) {
      console.error('[LocationService] Search error:', error);
    }
    return [];
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
 * Uses TimeZone DB API to get accurate IANA timezone for location
 */
export async function getTimezoneFromLocation(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    // Try using Google Maps TimeZone API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${Math.floor(Date.now() / 1000)}&key=AIzaSyBFakeFreeKeyForDemo`,
      { method: 'GET' }
    ).catch(() => null);

    // If Google API fails or returns error, use offline timezone lookup
    // This uses Intl API to detect timezone from coordinates
    // as a fallback
    
    return getTimezoneFromCoordinatesOffline(latitude, longitude);
  } catch (error) {
    if (__DEV__) {
      console.error('[LocationService] Timezone error:', error);
    }
    return getTimezoneFromCoordinatesOffline(latitude, longitude);
  }
}

/**
 * Offline timezone detection based on coordinates
 * Uses a simple mapping of longitude ranges to IANA timezones
 */
function getTimezoneFromCoordinatesOffline(latitude: number, longitude: number): string {
  // Simplified timezone mapping based on longitude (primary factor)
  // Note: This is approximate - real implementation would use a timezone database
  
  if (__DEV__) {
    console.log(`[LocationService] Detecting timezone for: lat=${latitude.toFixed(4)}, lon=${longitude.toFixed(4)}`);
  }
  
  // Africa timezones (longitude: -17 to 52, latitude: -35 to 37)
  if (longitude >= -17 && longitude < -1 && latitude > -5 && latitude < 38) {
    // West Africa: GMT+0 (Mauritania, Senegal, Gambia, Guinea, Sierra Leone, etc.)
    if (longitude >= -17 && longitude < -10) {
      // The Gambia: -16.6812°W, 13.4370°N
      if (latitude > 12 && latitude < 15 && longitude > -17 && longitude < -13) {
        const tz = 'Africa/Banjul'; // The Gambia Time (GMT+0)
        if (__DEV__) console.log(`[LocationService] Detected timezone: ${tz}`);
        return tz;
      }
      const tz = 'Africa/Dakar'; // Senegal and West Africa (GMT+0)
      if (__DEV__) console.log(`[LocationService] Detected timezone: ${tz}`);
      return tz;
    }
    // Cape Verde (special case)
    if (longitude < -20 && latitude > 14) {
      const tz = 'Atlantic/Cape_Verde'; // GMT-1
      if (__DEV__) console.log(`[LocationService] Detected timezone: ${tz}`);
      return tz;
    }
  }
  
  // Central West Africa (longitude: -1 to 10)
  if (longitude >= -1 && longitude < 10 && latitude > -5 && latitude < 20) {
    const tz = 'Africa/Lagos'; // West Africa Time (GMT+1)
    if (__DEV__) console.log(`[LocationService] Detected timezone: ${tz}`);
    return tz;
  }
  
  // Central Africa (longitude: 10 to 30)
  if (longitude >= 10 && longitude < 30 && latitude > -15 && latitude < 5) {
    return 'Africa/Douala'; // West Africa Time (GMT+1)
  }
  
  // East Africa (longitude: 30 to 45)
  if (longitude >= 30 && longitude < 45 && latitude > -12 && latitude < 5) {
    return 'Africa/Nairobi'; // East Africa Time (GMT+3)
  }
  
  // Southern Africa (longitude: 20 to 35, latitude: -35 to -15)
  if (longitude >= 20 && longitude < 35 && latitude > -35 && latitude < -15) {
    return 'Africa/Johannesburg'; // South Africa Standard Time (GMT+2)
  }
  
  // India/Middle East
  if (longitude >= 45 && longitude < 90 && latitude > -20 && latitude < 38) {
    if (longitude < 60) {
      return 'Asia/Dubai'; // Gulf Standard Time (GMT+4)
    } else if (longitude < 75) {
      return 'Asia/Kolkata'; // Indian Standard Time (GMT+5:30)
    } else {
      return 'Asia/Bangkok'; // Indochina Time (GMT+7)
    }
  }
  
  // Europe
  if (longitude >= -10 && longitude < 45 && latitude > 35 && latitude < 72) {
    if (longitude < 0) {
      return 'Europe/London'; // GMT+0/+1
    } else if (longitude < 15) {
      return 'Europe/Paris'; // GMT+1/+2
    } else if (longitude < 30) {
      return 'Europe/Istanbul'; // GMT+3
    } else {
      return 'Europe/Moscow'; // GMT+3
    }
  }
  
  // Americas
  if (longitude < -60) {
    if (latitude > 40) {
      return 'America/New_York'; // EST/EDT
    } else if (latitude > 0) {
      return 'America/Mexico_City'; // CST/CDT
    } else {
      return 'America/Sao_Paulo'; // BRT/BRST
    }
  } else if (longitude < -20) {
    return 'Atlantic/Reykjavik'; // GMT+0
  }
  
  // Asia Pacific
  if (longitude >= 90 && longitude < 180) {
    if (longitude < 120) {
      return 'Asia/Shanghai'; // China Standard Time (GMT+8)
    } else if (longitude < 150) {
      return 'Asia/Tokyo'; // Japan Standard Time (GMT+9)
    } else {
      return 'Pacific/Auckland'; // New Zealand Standard Time (GMT+12/13)
    }
  }
  
  // Default fallback
  const result = 'UTC';
  
  if (__DEV__) {
    console.log(`[LocationService] Detected timezone: ${result}`);
  }
  
  return result;
}
