/**
 * Deprecated Moment Alignment Details Screen
 * Redirects to the active tab-based screen.
 */

import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function MomentAlignmentDetailsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(tabs)/moment-alignment-detail');
  }, [router]);

  return null;
}
