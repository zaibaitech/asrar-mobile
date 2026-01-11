/**
 * 🔒 Planet Detail Screen - FROZEN FOR LAUNCH
 * ====================
 * This module is being refined and will return in a future update.
 * Users will be redirected to PlanetaryComingSoonScreen.
 * 
 * BACKUP: Full original code preserved in planet-detail.tsx.frozen_backup
 * To re-enable: Restore from backup file after launch.
 */

import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function PlanetDetailScreen() {
  const router = useRouter();

  useEffect(() => {
    // 🔒 Redirect to coming soon screen
    router.replace('/(tabs)/planetary-coming-soon');
  }, []);

  return null;
}
