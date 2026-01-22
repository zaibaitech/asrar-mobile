/**
 * User Profile Storage Service
 * =============================
 * Local storage for user profile (guest mode)
 * 
 * Privacy:
 * - All data stored locally in AsyncStorage
 * - No logging of profile values
 * - No external transmission (guest mode)
 * 
 * Storage key: "asrar.profile.v1"
 */

import {
    DEFAULT_USER_PROFILE,
    ProfileCompletionStatus,
    ProfileValidationError,
    ProfileValidationResult,
    UserProfile,
} from '@/types/user-profile';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// STORAGE KEY
// ============================================================================

const STORAGE_KEY = 'asrar.profile.v1';

// ============================================================================
// PROFILE CRUD OPERATIONS
// ============================================================================

/**
 * Load user profile from local storage
 * Returns null if no profile exists
 */
export async function loadProfile(): Promise<UserProfile | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
      return null;
    }
    
    const profile: UserProfile = JSON.parse(stored);
    
    // Validate structure
    if (!profile.timezone || !profile.createdAt) {
      if (__DEV__) {
        console.warn('[UserProfileStorage] Invalid profile structure, creating new');
      }
      return null;
    }
    
    return profile;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[UserProfileStorage] Error loading profile:', error);
    }
    return null;
  }
}

/**
 * Save user profile to local storage
 * Updates timestamp automatically
 */
export async function saveProfile(profile: UserProfile): Promise<void> {
  try {
    // Update timestamp
    const updatedProfile: UserProfile = {
      ...profile,
      updatedAt: Date.now(),
    };
    
    // Validate before saving
    const validation = validateProfile(updatedProfile);
    if (!validation.valid) {
      throw new Error(`Profile validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
    }
    
    // Save to storage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    
    if (__DEV__) {
      console.log('[UserProfileStorage] Profile saved successfully');
    }
    
  } catch (error) {
    if (__DEV__) {
      console.error('[UserProfileStorage] Error saving profile:', error);
    }
    throw error;
  }
}

/**
 * Update specific fields in profile
 * Merges with existing profile
 */
export async function updateProfile(
  updates: Partial<Omit<UserProfile, 'createdAt' | 'updatedAt'>>
): Promise<UserProfile> {
  try {
    const currentProfile = await loadProfile();
    
    const updatedProfile: UserProfile = {
      ...(currentProfile || DEFAULT_USER_PROFILE),
      ...updates,
      updatedAt: Date.now(),
    };
    
    await saveProfile(updatedProfile);
    
    return updatedProfile;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[UserProfileStorage] Error updating profile:', error);
    }
    throw error;
  }
}

/**
 * Clear user profile (reset to guest)
 * Use with caution - this deletes all personalization data
 */
export async function clearProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    
    if (__DEV__) {
      console.log('[UserProfileStorage] Profile cleared');
    }
    
  } catch (error) {
    if (__DEV__) {
      console.error('[UserProfileStorage] Error clearing profile:', error);
    }
    throw error;
  }
}

/**
 * Initialize profile if doesn't exist
 * Returns existing profile or creates new default
 */
export async function initializeProfile(): Promise<UserProfile> {
  try {
    const existing = await loadProfile();
    
    if (existing) {
      return existing;
    }
    
    // Create new default profile
    const newProfile: UserProfile = {
      ...DEFAULT_USER_PROFILE,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    await saveProfile(newProfile);
    
    return newProfile;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[UserProfileStorage] Error initializing profile:', error);
    }
    return DEFAULT_USER_PROFILE;
  }
}

// ============================================================================
// PROFILE ANALYSIS
// ============================================================================

/**
 * Check profile completion status
 * Helps determine which features are available
 */
export function getProfileCompletionStatus(
  profile: UserProfile
): ProfileCompletionStatus {
  const hasDOB = !!profile.dobISO;
  const hasName = !!profile.nameAr;
  const hasLocation = !!profile.location;
  
  const missingFields: Array<'dob' | 'name' | 'location'> = [];
  
  if (!hasDOB) missingFields.push('dob');
  if (!hasName) missingFields.push('name');
  if (!hasLocation) missingFields.push('location');
  
  // Calculate completion percentage
  // DOB: 50%, Name: 30%, Location: 20%
  let completionPercent = 0;
  if (hasDOB) completionPercent += 50;
  if (hasName) completionPercent += 30;
  if (hasLocation) completionPercent += 20;
  
  return {
    hasDOB,
    hasName,
    hasLocation,
    completionPercent,
    missingFields,
  };
}

/**
 * Check if profile has minimum data for feature
 */
export function canUseFeature(
  profile: UserProfile,
  feature: 'divine-timing' | 'name-destiny' | 'compatibility' | 'istikhara'
): boolean {
  const status = getProfileCompletionStatus(profile);
  
  switch (feature) {
    case 'divine-timing':
      // Divine Timing works best with DOB (for burj/element)
      // But can work without it (general mode)
      return true; // Always available
    
    case 'name-destiny':
      // Requires Arabic name for Abjad calculations
      return status.hasName;
    
    case 'compatibility':
      // Requires at least one Arabic name
      return status.hasName;
    
    case 'istikhara':
      // Works better with DOB and name, but not required
      return true; // Always available
    
    default:
      return false;
  }
}

/**
 * Get personalization level (0-3)
 * 0 = No personalization (guest with no data)
 * 1 = Basic (DOB or name)
 * 2 = Enhanced (DOB + name)
 * 3 = Full (DOB + name + location)
 */
export function getPersonalizationLevel(profile: UserProfile): number {
  const status = getProfileCompletionStatus(profile);
  
  if (status.hasDOB && status.hasName && status.hasLocation) {
    return 3; // Full personalization
  }
  
  if (status.hasDOB && status.hasName) {
    return 2; // Enhanced personalization
  }
  
  if (status.hasDOB || status.hasName) {
    return 1; // Basic personalization
  }
  
  return 0; // No personalization
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate user profile
 * Checks data integrity and format
 */
export function validateProfile(profile: UserProfile): ProfileValidationResult {
  const errors: ProfileValidationError[] = [];
  
  // Required fields
  if (!profile.timezone) {
    errors.push({
      field: 'timezone',
      message: 'Timezone is required',
    });
  }
  
  if (!profile.mode) {
    errors.push({
      field: 'mode',
      message: 'Profile mode is required',
    });
  }
  
  // DOB format validation (if provided)
  if (profile.dobISO) {
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dobRegex.test(profile.dobISO)) {
      errors.push({
        field: 'dobISO',
        message: 'DOB must be in YYYY-MM-DD format',
      });
    } else {
      // Check if valid date
      const date = new Date(profile.dobISO);
      if (isNaN(date.getTime())) {
        errors.push({
          field: 'dobISO',
          message: 'DOB is not a valid date',
        });
      }
      
      // Check if not in future
      if (date > new Date()) {
        errors.push({
          field: 'dobISO',
          message: 'DOB cannot be in the future',
        });
      }
      
      // Check if reasonable (not before 1900)
      if (date.getFullYear() < 1900) {
        errors.push({
          field: 'dobISO',
          message: 'DOB must be after 1900',
        });
      }
    }
  }

  // Birth time format validation (if provided)
  if (profile.birthTime) {
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(profile.birthTime)) {
      errors.push({
        field: 'birthTime',
        message: 'Birth time must be in HH:mm format',
      });
    } else {
      const [hhRaw, mmRaw] = profile.birthTime.split(':');
      const hours = Number(hhRaw);
      const minutes = Number(mmRaw);

      const valid =
        Number.isFinite(hours) &&
        Number.isFinite(minutes) &&
        hours >= 0 &&
        hours <= 23 &&
        minutes >= 0 &&
        minutes <= 59;

      if (!valid) {
        errors.push({
          field: 'birthTime',
          message: 'Birth time must be a valid 24h time',
        });
      }
    }
  }
  
  // Location validation (if provided)
  if (profile.location) {
    if (profile.location.latitude < -90 || profile.location.latitude > 90) {
      errors.push({
        field: 'location',
        message: 'Latitude must be between -90 and 90',
      });
    }
    
    if (profile.location.longitude < -180 || profile.location.longitude > 180) {
      errors.push({
        field: 'location',
        message: 'Longitude must be between -180 and 180',
      });
    }
  }

  // Birth location validation (if provided)
  if (profile.birthLocation) {
    if (profile.birthLocation.latitude < -90 || profile.birthLocation.latitude > 90) {
      errors.push({
        field: 'birthLocation',
        message: 'Birth latitude must be between -90 and 90',
      });
    }

    if (profile.birthLocation.longitude < -180 || profile.birthLocation.longitude > 180) {
      errors.push({
        field: 'birthLocation',
        message: 'Birth longitude must be between -180 and 180',
      });
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate DOB string format
 */
export function isValidDOB(dobISO: string): boolean {
  const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!dobRegex.test(dobISO)) {
    return false;
  }
  
  const date = new Date(dobISO);
  
  if (isNaN(date.getTime())) {
    return false;
  }
  
  if (date > new Date()) {
    return false;
  }
  
  if (date.getFullYear() < 1900) {
    return false;
  }
  
  return true;
}

// ============================================================================
// EXPORT & IMPORT (FOR BACKUP)
// ============================================================================

/**
 * Export profile as JSON string
 * For backup or migration purposes
 */
export async function exportProfile(): Promise<string | null> {
  try {
    const profile = await loadProfile();
    
    if (!profile) {
      return null;
    }
    
    return JSON.stringify(profile, null, 2);
    
  } catch (error) {
    if (__DEV__) {
      console.error('[UserProfileStorage] Error exporting profile:', error);
    }
    return null;
  }
}

/**
 * Import profile from JSON string
 * Validates before importing
 */
export async function importProfile(jsonString: string): Promise<boolean> {
  try {
    const profile: UserProfile = JSON.parse(jsonString);
    
    const validation = validateProfile(profile);
    
    if (!validation.valid) {
      if (__DEV__) {
        console.error('[UserProfileStorage] Invalid profile for import:', validation.errors);
      }
      return false;
    }
    
    await saveProfile(profile);
    
    return true;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[UserProfileStorage] Error importing profile:', error);
    }
    return false;
  }
}
