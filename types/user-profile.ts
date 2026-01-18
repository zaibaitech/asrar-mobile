/**
 * User Profile Type Definitions
 * ==============================
 * Unified profile model for personalization across all modules
 * 
 * Purpose: Single source of truth for user data
 * - Name Destiny: Uses nameAr, motherName
 * - Divine Timing: Uses burj, element, location
 * - Compatibility: Uses nameAr, burj
 * - Istikhara: Uses nameAr, burj, element
 * - Home: Shows personalized greetings and content
 * 
 * Privacy: All data stored locally (AsyncStorage) until user enables account mode
 */

/**
 * User profile mode
 */
export type ProfileMode = 'guest' | 'account';

/**
 * Geographic location
 */
export interface UserLocation {
  /** Latitude */
  latitude: number;
  
  /** Longitude */
  longitude: number;
  
  /** Optional city/place label */
  label?: string;
}

/**
 * Derived astrological data
 * Auto-computed from DOB and other inputs
 */
export interface DerivedAstrologicalData {
  /** Burj (zodiac sign) - computed from DOB */
  burj?: string;
  
  /** Burj index (0-11, Aries to Pisces) */
  burjIndex?: number;
  
  /** Dominant element */
  element?: 'fire' | 'water' | 'air' | 'earth';
  
  /** Planetary ruler of burj */
  planetaryRuler?: 'sun' | 'moon' | 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn';
  
  /** Moon mansion (manazil) baseline - optional advanced feature */
  manazilBaseline?: number;

  /**
   * Personal Manazil (lunar mansion) derived from name + mother's name (Abjad total).
   * Used for personal mansion resonance against today's mansion.
   */
  manazilPersonal?: number;
}

/**
 * Complete user profile
 * This is the single source of truth for all personalization
 */
export interface UserProfile {
  /**
   * Profile mode
   * - guest: Local storage only (default)
   * - account: Synced to backend (requires sign-in)
   */
  mode: ProfileMode;
  
  /**
   * User's name in Arabic (optional)
   * Used for: Name Destiny, Compatibility, Istikhara
   */
  nameAr?: string;
  
  /**
   * User's name in Latin script (optional)
   * For display purposes
   */
  nameLatin?: string;
  
  /**
   * Mother's name (optional)
   * Used for: Advanced Abjad calculations
   * Only stored if user explicitly enables this feature
   */
  motherName?: string;
  
  /**
   * Date of birth (ISO format: YYYY-MM-DD)
   * Required for: Divine Timing, Istikhara personalization
   * Used to compute: burj, element, planetary ruler
   */
  dobISO?: string;
  
  /**
   * User's timezone (IANA format, e.g., 'America/New_York')
   * Auto-detected from device, can be manually adjusted
   */
  timezone: string;
  
  /**
   * User's location (optional)
   * Required for: Precise planetary hours, prayer times
   * Only requested if user enables location-based features
   */
  location?: UserLocation;
  
  /**
   * Derived astrological data
   * Auto-computed when DOB is provided
   * Do not edit manually - use derivation service
   */
  derived?: DerivedAstrologicalData;
  
  /**
   * Profile creation timestamp
   */
  createdAt: number;
  
  /**
   * Last update timestamp
   */
  updatedAt: number;
  
  /**
   * Account-specific data (when mode === 'account')
   */
  account?: {
    /** User ID from backend */
    userId?: string;
    
    /** Email (if provided) */
    email?: string;
    
    /** Last sync timestamp */
    lastSyncAt?: number;
  };
}

/**
 * Partial profile update
 * Used when updating specific fields
 */
export type PartialProfileUpdate = Partial<Omit<UserProfile, 'createdAt' | 'updatedAt' | 'derived'>>;

/**
 * Profile completion status
 * Helps determine which features are available
 */
export interface ProfileCompletionStatus {
  /** Has DOB (required for personalized timing) */
  hasDOB: boolean;
  
  /** Has Arabic name (required for Abjad calculations) */
  hasName: boolean;
  
  /** Has location (required for precise calculations) */
  hasLocation: boolean;
  
  /** Overall completion percentage (0-100) */
  completionPercent: number;
  
  /** Missing fields for full personalization */
  missingFields: Array<'dob' | 'name' | 'location'>;
}

/**
 * Default profile for new users
 */
export const DEFAULT_USER_PROFILE: UserProfile = {
  mode: 'guest',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

/**
 * Profile validation errors
 */
export interface ProfileValidationError {
  field: keyof UserProfile;
  message: string;
}

/**
 * Profile validation result
 */
export interface ProfileValidationResult {
  valid: boolean;
  errors: ProfileValidationError[];
}
