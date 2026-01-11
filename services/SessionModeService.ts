/**
 * Session Mode Service
 * ====================
 * Manages user session mode (Guest vs Authenticated)
 * 
 * Features:
 * - Track guest mode status
 * - Clear guest mode on sign-in
 * - Persistent storage across app restarts
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const GUEST_MODE_KEY = '@asrar_guest_mode';

/**
 * Check if user is in guest mode
 */
export async function getGuestMode(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(GUEST_MODE_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error reading guest mode:', error);
    return false;
  }
}

/**
 * Set guest mode status
 * @param isGuest - true for guest mode, false for authenticated
 */
export async function setGuestMode(isGuest: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(GUEST_MODE_KEY, isGuest ? 'true' : 'false');
  } catch (error) {
    console.error('Error saving guest mode:', error);
  }
}

/**
 * Clear guest mode (called after successful sign-in)
 */
export async function clearGuestMode(): Promise<void> {
  try {
    await AsyncStorage.setItem(GUEST_MODE_KEY, 'false');
  } catch (error) {
    console.error('Error clearing guest mode:', error);
  }
}

/**
 * Reset session mode (for testing/debugging)
 */
export async function resetSessionMode(): Promise<void> {
  try {
    await AsyncStorage.removeItem(GUEST_MODE_KEY);
  } catch (error) {
    console.error('Error resetting session mode:', error);
  }
}
