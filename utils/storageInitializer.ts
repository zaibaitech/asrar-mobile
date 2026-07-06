/**
 * Storage Initializer
 * 
 * Handles app-wide storage initialization and maintenance.
 * Call initializeStorage() once on app startup.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { emergencyStorageCleanup, logStorageDiagnostics } from './storageErrorHandler';

const LAST_MAINTENANCE_KEY = '@storage_last_maintenance';
const MAINTENANCE_INTERVAL = 24 * 60 * 60 * 1000; // 1 day
const MAX_ITEM_SIZE_BYTES = 200 * 1024; // 200KB per key
const EMERGENCY_ITEM_SIZE_BYTES = 64 * 1024; // 64KB under recovery
const MAX_ARRAY_ITEMS_DEFAULT = 200;

// Monkey-patch AsyncStorage.setItem to add automatic error handling
const originalSetItem = AsyncStorage.setItem;
const originalMultiSet = AsyncStorage.multiSet;
let isPatched = false;
let isRecoveryInProgress = false;

/**
 * Initialize storage system with automatic error handling
 * Call this once in your app entry point (e.g., App.tsx or _layout.tsx)
 */
export async function initializeStorage(): Promise<void> {
  try {
    console.log('🗄️ Initializing storage system...');

    // Check if maintenance is needed
    await performScheduledMaintenance();

    // Patch AsyncStorage.setItem globally
    if (!isPatched) {
      patchAsyncStorage();
      console.log('✓ Storage error handling enabled');
    }

    // Log diagnostics in dev mode
    if (__DEV__) {
      await logStorageDiagnostics();
    }

    console.log('✓ Storage system initialized');
  } catch (error) {
    console.error('Failed to initialize storage:', error);
  }
}

/**
 * Perform scheduled maintenance if needed
 */
async function performScheduledMaintenance(): Promise<void> {
  try {
    const lastMaintenance = await AsyncStorage.getItem(LAST_MAINTENANCE_KEY);
    const now = Date.now();
    
    if (!lastMaintenance || now - Number(lastMaintenance) > MAINTENANCE_INTERVAL) {
      console.log('🧹 Running scheduled storage maintenance...');
      await emergencyStorageCleanup();
      await originalSetItem.call(AsyncStorage, LAST_MAINTENANCE_KEY, now.toString());
      console.log('✓ Storage maintenance completed');
    }
  } catch (error) {
    console.error('Scheduled maintenance failed:', error);
  }
}

/**
 * Patch AsyncStorage.setItem to automatically handle storage full errors
 */
function patchAsyncStorage(): void {
  AsyncStorage.setItem = async function patchedSetItem(
    key: string,
    value: string
  ): Promise<void> {
    // During recovery cleanup, bypass patch logic to avoid recursive retries.
    if (isRecoveryInProgress) {
      await originalSetItem.call(AsyncStorage, key, value);
      return;
    }

    try {
      const preparedValue = reducePayloadToFit(value, MAX_ITEM_SIZE_BYTES);
      await originalSetItem.call(AsyncStorage, key, preparedValue);
    } catch (error: any) {
      if (!isStorageFullError(error)) {
        throw error;
      }

      console.warn(`⚠️ Storage full detected while saving ${key}, running cleanup...`);

      isRecoveryInProgress = true;
      try {
        await emergencyStorageCleanup();
      } finally {
        isRecoveryInProgress = false;
      }

      try {
        const reduced = reducePayloadToFit(value, EMERGENCY_ITEM_SIZE_BYTES);
        await originalSetItem.call(AsyncStorage, key, reduced);
        console.log(`✓ Successfully saved ${key} after cleanup`);
      } catch (retryError) {
        // Storage still full after cleanup — let the caller decide how to handle it.
        console.warn(`Storage still full after cleanup, dropping ${key}`);
        throw error;
      }
    }
  };

  AsyncStorage.multiSet = async function patchedMultiSet(
    keyValuePairs: readonly (readonly [string, string])[]
  ): Promise<void> {
    if (isRecoveryInProgress) {
      await originalMultiSet.call(AsyncStorage, keyValuePairs);
      return;
    }

    const preparedPairs = keyValuePairs.map(([key, value]) => [
      key,
      reducePayloadToFit(value, MAX_ITEM_SIZE_BYTES),
    ] as const);

    try {
      await originalMultiSet.call(AsyncStorage, preparedPairs);
    } catch (error: any) {
      if (!isStorageFullError(error)) {
        throw error;
      }

      console.warn('⚠️ Storage full detected during multiSet, running cleanup...');
      isRecoveryInProgress = true;
      try {
        await emergencyStorageCleanup();
      } finally {
        isRecoveryInProgress = false;
      }

      const reducedPairs = keyValuePairs.map(([key, value]) => [
        key,
        reducePayloadToFit(value, EMERGENCY_ITEM_SIZE_BYTES),
      ] as const);

      await originalMultiSet.call(AsyncStorage, reducedPairs);
    }
  };
  
  isPatched = true;
}

/**
 * Check if error is due to storage being full
 */
function isStorageFullError(error: any): boolean {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorString = String(error).toLowerCase();
  
  return (
    errorMessage.includes('sqlite_full') ||
    errorMessage.includes('database or disk is full') ||
    errorMessage.includes('quota exceeded') ||
    errorMessage.includes('disk is full') ||
    errorString.includes('sqlite_full') ||
    error?.code === 13 ||
    error?.code === 'SQLITE_FULL'
  );
}

/**
 * Try to reduce data size before saving
 */
function reducePayloadToFit(value: string, targetBytes: number): string {
  if (estimateStringBytes(value) <= targetBytes) {
    return value;
  }

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      const reduced = reduceArrayToFit(parsed, targetBytes);
      return JSON.stringify(reduced);
    }

    if (parsed && typeof parsed === 'object') {
      const reducedObject = reduceObjectToFit(parsed as Record<string, unknown>, targetBytes);
      return JSON.stringify(reducedObject);
    }

    return value.slice(0, Math.floor(targetBytes / 2));
  } catch {
    // Not JSON; trim string payload as a last resort.
    return value.slice(0, Math.floor(targetBytes / 2));
  }
}

function reduceArrayToFit(data: unknown[], targetBytes: number): unknown[] {
  if (data.length <= 1) {
    return data;
  }

  let limit = Math.min(data.length, MAX_ARRAY_ITEMS_DEFAULT);
  let candidate = data.slice(0, limit);

  while (estimateStringBytes(JSON.stringify(candidate)) > targetBytes && limit > 1) {
    limit = Math.max(1, Math.floor(limit / 2));
    candidate = data.slice(0, limit);
  }

  return candidate;
}

function reduceObjectToFit(data: Record<string, unknown>, targetBytes: number): Record<string, unknown> {
  const clone: Record<string, unknown> = { ...data };

  // Drop obviously large/debug payload fields first.
  const heavyFields = ['raw', 'response', 'payload', 'details', 'trace', 'debug', 'content', 'notes'];
  for (const field of heavyFields) {
    if (field in clone) {
      delete clone[field];
      if (estimateStringBytes(JSON.stringify(clone)) <= targetBytes) {
        return clone;
      }
    }
  }

  // Reduce array properties if present.
  for (const [key, value] of Object.entries(clone)) {
    if (Array.isArray(value)) {
      clone[key] = reduceArrayToFit(value, Math.floor(targetBytes * 0.75));
    }
  }

  const serialized = JSON.stringify(clone);
  if (estimateStringBytes(serialized) <= targetBytes) {
    return clone;
  }

  // Last fallback: keep only scalar fields.
  const scalarOnly: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(clone)) {
    if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) {
      scalarOnly[key] = value;
    }
  }
  return scalarOnly;
}

function estimateStringBytes(value: string): number {
  return value.length * 2;
}

/**
 * Manually trigger storage cleanup
 * Can be called from settings or when user reports issues
 */
export async function manualStorageCleanup(): Promise<void> {
  console.log('🧹 Running manual storage cleanup...');
  await emergencyStorageCleanup();
  await originalSetItem.call(AsyncStorage, LAST_MAINTENANCE_KEY, Date.now().toString());
  console.log('✓ Manual cleanup completed');
}

/**
 * Get storage health status
 */
export async function getStorageHealth(): Promise<{
  isHealthy: boolean;
  totalKeys: number;
  estimatedSizeMB: number;
  lastMaintenance?: Date;
}> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    let totalSize = 0;
    
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        totalSize += value.length * 2; // UTF-16 = 2 bytes per char
      }
    }
    
    const lastMaintenance = await AsyncStorage.getItem(LAST_MAINTENANCE_KEY);
    
    return {
      isHealthy: totalSize < 5 * 1024 * 1024, // < 5MB is healthy
      totalKeys: keys.length,
      estimatedSizeMB: totalSize / (1024 * 1024),
      lastMaintenance: lastMaintenance ? new Date(Number(lastMaintenance)) : undefined,
    };
  } catch (error) {
    console.error('Failed to get storage health:', error);
    return {
      isHealthy: false,
      totalKeys: 0,
      estimatedSizeMB: 0,
    };
  }
}
