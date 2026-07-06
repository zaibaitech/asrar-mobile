/**
 * Storage Error Handler Utility
 * 
 * Centralized error handling for AsyncStorage operations.
 * Detects and handles storage full errors (SQLITE_FULL) across the app.
 * 
 * @module storageErrorHandler
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Check if error is due to storage being full
 */
export function isStorageFullError(error: any): boolean {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorString = String(error).toLowerCase();
  
  return (
    errorMessage.includes('sqlite_full') ||
    errorMessage.includes('database or disk is full') ||
    errorMessage.includes('quota exceeded') ||
    errorMessage.includes('disk is full') ||
    errorString.includes('sqlite_full') ||
    error?.code === 13 || // SQLite FULL error code
    error?.code === 'SQLITE_FULL'
  );
}

/**
 * Get all AsyncStorage keys
 */
export async function getAllStorageKeys(): Promise<readonly string[]> {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Failed to get storage keys:', error);
    return [];
  }
}

/**
 * Get storage size estimate (approximate)
 */
export async function getStorageSizeEstimate(): Promise<number> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    let totalSize = 0;
    
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        // Estimate size in bytes (rough)
        totalSize += value.length * 2; // UTF-16 characters = 2 bytes each
      }
    }
    
    return totalSize;
  } catch (error) {
    console.error('Failed to estimate storage size:', error);
    return 0;
  }
}

/**
 * Clean up array-based storage items by keeping only recent entries
 */
async function cleanupArrayStorage(key: string, value: string, maxItems: number): Promise<boolean> {
  try {
    const data = JSON.parse(value);
    if (Array.isArray(data) && data.length > maxItems) {
      const reduced = data.slice(0, maxItems);
      await AsyncStorage.setItem(key, JSON.stringify(reduced));
      console.log(`✓ Reduced ${key} from ${data.length} to ${reduced.length} items`);
      return true;
    }
  } catch {
    // Not parseable or not an array
  }
  return false;
}

/**
 * Remove old items from array-based storage (older than 30 days)
 */
async function removeOldItems(key: string, value: string): Promise<boolean> {
  try {
    const data = JSON.parse(value);
    if (!Array.isArray(data)) return false;
    
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    
    const filtered = data.filter((entry: any) => {
      const timestamp = entry.timestamp || entry.createdAt || entry.date;
      if (timestamp) {
        const date = new Date(timestamp).getTime();
        return date > thirtyDaysAgo;
      }
      return true;
    });
    
    if (filtered.length < data.length) {
      await AsyncStorage.setItem(key, JSON.stringify(filtered));
      console.log(`✓ Removed ${data.length - filtered.length} old items from ${key}`);
      return true;
    }
  } catch {
    // Not parseable
  }
  return false;
}

/**
 * Emergency storage cleanup
 * Attempts to free up space by removing old/large items
 */
export async function emergencyStorageCleanup(): Promise<void> {
  try {
    console.log('🚨 Running emergency storage cleanup...');
    
    const keys = await AsyncStorage.getAllKeys();
    const keysWithSizes: Array<{ key: string; size: number; value: string }> = [];
    
    // Get size of each item
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        keysWithSizes.push({ key, size: value.length, value });
      }
    }
    
    // Sort by size (largest first)
    keysWithSizes.sort((a, b) => b.size - a.size);
    
    console.log(`Found ${keysWithSizes.length} storage items`);
    console.log('Top 5 largest:', keysWithSizes.slice(0, 5).map(k => ({
      key: k.key,
      sizeKB: (k.size / 1024).toFixed(2)
    })));
    
    // Strategy 1: Remove all date-keyed caches — they are fully regenerable.
    const dateKeyPrefixes = ['@asrar_planetary_hours_', '@asrar_prayer_times_day_', '@asrar_prayer_month_'];
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const oldDateKeys = keys.filter(key => {
      for (const prefix of dateKeyPrefixes) {
        if (key.startsWith(prefix)) {
          const datePart = key.slice(prefix.length); // e.g. "2026-04-01"
          // Keep only today's entry; remove everything else (past AND future).
          return datePart !== todayStr;
        }
      }
      return false;
    });

    if (oldDateKeys.length > 0) {
      await AsyncStorage.multiRemove(oldDateKeys);
      console.log(`✓ Removed ${oldDateKeys.length} date-keyed cache entries`);
    }

    // Strategy 2: Clean up history/cache/temp keys
    const historyKeys = keysWithSizes.filter(k => 
      k.key.includes('history') || k.key.includes('cache') || k.key.includes('temp')
    );
    
    for (const item of historyKeys) {
      await cleanupArrayStorage(item.key, item.value, 5);
    }
    
    // Strategy 3: Remove old items (> 30 days)
    for (const item of keysWithSizes) {
      await removeOldItems(item.key, item.value);
    }
    
    console.log('✓ Emergency cleanup completed');
  } catch (error) {
    console.error('Emergency cleanup failed:', error);
    await performLastResortCleanup();
  }
}

/**
 * Last resort cleanup - remove non-essential keys
 */
async function performLastResortCleanup(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const nonEssentialKeys = keys.filter(key => 
      key.includes('cache') || key.includes('temp') || key.includes('history') ||
      key.startsWith('@asrar_planetary_hours_') || key.startsWith('@asrar_prayer_times_day_') ||
      key.startsWith('@asrar_prayer_month_')
    );
    
    if (nonEssentialKeys.length > 0) {
      await AsyncStorage.multiRemove(nonEssentialKeys);
      console.log(`✓ Removed ${nonEssentialKeys.length} non-essential keys`);
    }
  } catch (error) {
    console.error('Last resort cleanup failed:', error);
  }
}

/**
 * Try to reduce array data before saving
 */
async function trySaveReducedData(key: string, value: string): Promise<boolean> {
  try {
    const data = JSON.parse(value);
    if (Array.isArray(data) && data.length > 10) {
      const reduced = data.slice(0, 10);
      await AsyncStorage.setItem(key, JSON.stringify(reduced));
      console.log(`✓ Saved reduced data (${reduced.length} items instead of ${data.length})`);
      return true;
    }
  } catch {
    // Not JSON or not an array
  }
  return false;
}

/**
 * Wrapper for AsyncStorage.setItem with automatic error handling and retry
 */
export async function setItemWithRetry(
  key: string,
  value: string,
  maxRetries: number = 1
): Promise<void> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await AsyncStorage.setItem(key, value);
      return; // Success
    } catch (error) {
      lastError = error;
      console.error(`Failed to save ${key} (attempt ${attempt + 1}/${maxRetries + 1}):`, error);
      
      if (isStorageFullError(error) && attempt < maxRetries) {
        console.log('Storage full detected, running cleanup...');
        await emergencyStorageCleanup();
        
        // Try to save reduced data
        const saved = await trySaveReducedData(key, value);
        if (saved) return;
      } else if (!isStorageFullError(error)) {
        // If it's not a storage full error, don't retry
        throw error;
      }
    }
  }
  
  throw lastError; // All retries failed
}

/**
 * Log storage diagnostics
 */
export async function logStorageDiagnostics(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const sizeEstimate = await getStorageSizeEstimate();
    
    console.log('📊 Storage Diagnostics:');
    console.log(`- Total keys: ${keys.length}`);
    console.log(`- Estimated size: ${(sizeEstimate / 1024).toFixed(2)} KB`);
    console.log(`- Estimated size: ${(sizeEstimate / (1024 * 1024)).toFixed(2)} MB`);
    
    // Group by prefix
    const groupedKeys: Record<string, number> = {};
    keys.forEach(key => {
      const prefix = key.split('_')[0] || 'other';
      groupedKeys[prefix] = (groupedKeys[prefix] || 0) + 1;
    });
    
    console.log('- Keys by prefix:', groupedKeys);
  } catch (error) {
    console.error('Failed to log diagnostics:', error);
  }
}
