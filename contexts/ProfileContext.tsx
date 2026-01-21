/**
 * Profile Context
 * ===============
 * Global state for user profile across all app modules
 * 
 * Features:
 * - Loads profile at app startup
 * - Provides profile data to all screens
 * - Auto-derives astrological data when DOB changes
 * - Tracks profile completion status
 * - Supports partial updates
 * 
 * Privacy:
 * - All data local (guest mode)
 * - No external transmission
 * - Optional cloud sync (future - account mode)
 */

import { getSession, syncProfileToCloud } from '@/services/AuthService';
import {
    deriveAstrologicalData,
    updateProfileWithDerivedData,
} from '@/services/ProfileDerivationService';
import {
    canUseFeature,
    clearProfile,
    getPersonalizationLevel,
    getProfileCompletionStatus,
    initializeProfile,
    loadProfile,
    saveProfile,
    updateProfile,
} from '@/services/UserProfileStorage';
import {
    DEFAULT_USER_PROFILE,
    PartialProfileUpdate,
    ProfileCompletionStatus,
    UserProfile,
} from '@/types/user-profile';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// ============================================================================
// CONTEXT TYPE
// ============================================================================

interface ProfileContextType {
  // Current profile
  profile: UserProfile;
  
  // Loading state
  isLoading: boolean;
  
  // Completion status
  completionStatus: ProfileCompletionStatus;
  
  // Personalization level (0-3)
  personalizationLevel: number;
  
  // Actions
  setProfile: (updates: PartialProfileUpdate) => Promise<void>;
  refreshDerived: () => Promise<void>;
  resetProfile: () => Promise<void>;
  reloadProfile: () => Promise<void>;
  
  // Feature availability checks
  canUseDivineTiming: boolean;
  canUseNameDestiny: boolean;
  canUseCompatibility: boolean;
  canUseIstikhara: boolean;
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [completionStatus, setCompletionStatus] = useState<ProfileCompletionStatus>({
    hasDOB: false,
    hasName: false,
    hasLocation: false,
    completionPercent: 0,
    missingFields: ['dob', 'name', 'location'],
  });
  const [personalizationLevel, setPersonalizationLevel] = useState(0);
  
  // Feature availability flags
  const [canUseDivineTiming, setCanUseDivineTiming] = useState(true);
  const [canUseNameDestiny, setCanUseNameDestiny] = useState(false);
  const [canUseCompatibility, setCanUseCompatibility] = useState(false);
  const [canUseIstikhara, setCanUseIstikhara] = useState(true);
  
  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  const needsDerivedBackfill = useCallback((p: UserProfile): boolean => {
    const needsBaseline = !!p.dobISO && (!p.derived || typeof p.derived.manazilBaseline !== 'number');
    const needsPersonal = !!p.nameAr && (!p.derived || typeof p.derived.manazilPersonal !== 'number');
    return needsBaseline || needsPersonal;
  }, []);
  
  /**
   * Load profile at app startup
   */
  useEffect(() => {
    loadInitialProfile();
  }, []);
  
  const loadInitialProfile = async () => {
    try {
      setIsLoading(true);
      
      const initialProfile = await initializeProfile();

      // Backfill derived astrological data (incl. Manazil baseline) for profiles
      // that have DOB but were created before derivation existed.
      const ensuredProfile = needsDerivedBackfill(initialProfile)
        ? updateProfileWithDerivedData(initialProfile)
        : initialProfile;
      if (ensuredProfile !== initialProfile) {
        await saveProfile(ensuredProfile);
      }
      
      // Check if user has active auth session
      const session = await getSession();
      if (session) {
        // User is signed in - ensure account mode and sync email
        const needsUpdate = ensuredProfile.mode !== 'account' || 
                           ensuredProfile.account?.email !== session.email;
        
        if (needsUpdate) {
          const updatedProfile: UserProfile = {
            ...ensuredProfile,
            mode: 'account',
            account: {
              ...ensuredProfile.account,
              email: session.email,
              userId: session.userId,
            },
          };
          await saveProfile(updatedProfile);
          updateProfileState(updatedProfile);
          
          if (__DEV__) {
            console.log('[ProfileContext] Updated profile with session email:', session.email);
          }
        } else {
          updateProfileState(ensuredProfile);
        }
      } else {
        updateProfileState(ensuredProfile);
      }
      
    } catch (error) {
      if (__DEV__) {
        console.error('[ProfileContext] Error loading initial profile:', error);
      }
      
      // Fallback to default
      updateProfileState(DEFAULT_USER_PROFILE);
      
    } finally {
      setIsLoading(false);
    }
  };
  
  // ============================================================================
  // STATE UPDATE HELPERS
  // ============================================================================
  
  /**
   * Update all profile-related state
   */
  const updateProfileState = useCallback((newProfile: UserProfile) => {
    setProfileState(newProfile);
    
    const status = getProfileCompletionStatus(newProfile);
    setCompletionStatus(status);
    
    const level = getPersonalizationLevel(newProfile);
    setPersonalizationLevel(level);
    
    // Update feature availability
    setCanUseDivineTiming(canUseFeature(newProfile, 'divine-timing'));
    setCanUseNameDestiny(canUseFeature(newProfile, 'name-destiny'));
    setCanUseCompatibility(canUseFeature(newProfile, 'compatibility'));
    setCanUseIstikhara(canUseFeature(newProfile, 'istikhara'));
  }, []);
  
  // ============================================================================
  // PUBLIC ACTIONS
  // ============================================================================
  
  /**
   * Update profile (partial or full)
   * Auto-derives astrological data if DOB changes
   * Auto-syncs to cloud when in account mode
   */
  const handleSetProfile = useCallback(async (updates: PartialProfileUpdate) => {
    try {
      const dobChanged = updates.dobISO !== undefined && updates.dobISO !== profile.dobISO;
      const nameChanged =
        (updates.nameAr !== undefined && updates.nameAr !== profile.nameAr) ||
        (updates.motherName !== undefined && updates.motherName !== profile.motherName);
      
      // Update profile in storage
      const updatedProfile = await updateProfile(updates);
      
      let finalProfile = updatedProfile;
      
      // Re-derive if DOB changed, names changed, OR derived data is missing.
      if (dobChanged || nameChanged || needsDerivedBackfill(updatedProfile)) {
        const derivedProfile = updateProfileWithDerivedData(updatedProfile);
        await saveProfile(derivedProfile);
        updateProfileState(derivedProfile);
        finalProfile = derivedProfile;
      } else {
        updateProfileState(updatedProfile);
      }
      
      // Sync to cloud if in account mode
      if (finalProfile.mode === 'account') {
        const session = await getSession();
        if (session) {
          // Sync in background - don't block UI
          syncProfileToCloud(finalProfile).catch((err) => {
            if (__DEV__) {
              console.warn('[ProfileContext] Cloud sync failed:', err);
            }
          });
        }
      }
      
      if (__DEV__) {
        console.log('[ProfileContext] Profile updated successfully');
      }
      
    } catch (error) {
      if (__DEV__) {
        console.error('[ProfileContext] Error updating profile:', error);
      }
      throw error;
    }
  }, [profile.dobISO, profile.motherName, profile.nameAr, needsDerivedBackfill, updateProfileState]);
  
  /**
   * Re-derive astrological data from current DOB
   * Useful if derivation logic updates
   */
  const handleRefreshDerived = useCallback(async () => {
    try {
      const derived = deriveAstrologicalData(profile);
      
      if (derived) {
        const updatedProfile: UserProfile = {
          ...profile,
          derived,
          updatedAt: Date.now(),
        };
        
        await saveProfile(updatedProfile);
        updateProfileState(updatedProfile);
        
        if (__DEV__) {
          console.log('[ProfileContext] Derived data refreshed');
        }
      }
      
    } catch (error) {
      if (__DEV__) {
        console.error('[ProfileContext] Error refreshing derived data:', error);
      }
    }
  }, [profile, updateProfileState]);
  
  /**
   * Reset profile to default (guest mode)
   * USE WITH CAUTION - deletes all personalization
   */
  const handleResetProfile = useCallback(async () => {
    try {
      await clearProfile();
      
      const freshProfile = await initializeProfile();
      
      updateProfileState(freshProfile);
      
      if (__DEV__) {
        console.log('[ProfileContext] Profile reset to default');
      }
      
    } catch (error) {
      if (__DEV__) {
        console.error('[ProfileContext] Error resetting profile:', error);
      }
    }
  }, [updateProfileState]);
  
  /**
   * Reload profile from storage
   * Useful after import or external changes
   */
  const handleReloadProfile = useCallback(async () => {
    try {
      const reloadedProfile = await loadProfile();
      
      if (reloadedProfile) {
        updateProfileState(reloadedProfile);
      } else {
        const freshProfile = await initializeProfile();
        updateProfileState(freshProfile);
      }
      
      if (__DEV__) {
        console.log('[ProfileContext] Profile reloaded');
      }
      
    } catch (error) {
      if (__DEV__) {
        console.error('[ProfileContext] Error reloading profile:', error);
      }
    }
  }, [updateProfileState]);
  
  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================
  
  const value: ProfileContextType = {
    // Current state
    profile,
    isLoading,
    completionStatus,
    personalizationLevel,
    
    // Actions
    setProfile: handleSetProfile,
    refreshDerived: handleRefreshDerived,
    resetProfile: handleResetProfile,
    reloadProfile: handleReloadProfile,
    
    // Feature availability
    canUseDivineTiming,
    canUseNameDestiny,
    canUseCompatibility,
    canUseIstikhara,
  };
  
  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Use profile context in any component
 * 
 * Example:
 * ```tsx
 * const { profile, setProfile, completionStatus } = useProfile();
 * 
 * // Update DOB
 * await setProfile({ dobISO: '1990-01-15' });
 * 
 * // Check if name is provided
 * if (completionStatus.hasName) {
 *   // Use name for calculations
 * }
 * ```
 */
export function useProfile(): ProfileContextType {
  const context = useContext(ProfileContext);
  
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  
  return context;
}

// ============================================================================
// CONVENIENCE HOOKS
// ============================================================================

/**
 * Get only the profile data (no actions)
 * Useful for read-only components
 */
export function useProfileData(): UserProfile {
  const { profile } = useProfile();
  return profile;
}

/**
 * Get only completion status
 * Useful for conditional rendering
 */
export function useProfileCompletion(): ProfileCompletionStatus {
  const { completionStatus } = useProfile();
  return completionStatus;
}

/**
 * Get only derived astrological data
 * Returns null if no DOB provided
 */
export function useDerivedData() {
  const { profile } = useProfile();
  return profile.derived;
}

/**
 * Check if specific feature is available
 */
export function useFeatureAvailability() {
  const {
    canUseDivineTiming,
    canUseNameDestiny,
    canUseCompatibility,
    canUseIstikhara,
  } = useProfile();
  
  return {
    divineTiming: canUseDivineTiming,
    nameDestiny: canUseNameDestiny,
    compatibility: canUseCompatibility,
    istikhara: canUseIstikhara,
  };
}
