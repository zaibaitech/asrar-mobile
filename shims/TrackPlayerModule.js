/**
 * Safe shim for react-native-track-player's TrackPlayerModule.
 * Returns the real native module when available (dev/prod builds),
 * or a Proxy that returns 0 for any property access (Expo Go).
 * This prevents crashes during module-level enum initialization.
 */
import { NativeModules } from 'react-native';

const { TrackPlayerModule } = NativeModules;

export default TrackPlayerModule ?? new Proxy(
  {},
  {
    get: (_target, prop) => {
      // Return a no-op function for method calls, 0 for constants
      if (typeof prop === 'string' && prop.startsWith('CAPABILITY_')) return 0;
      if (typeof prop === 'string' && prop.startsWith('STATE_')) return 0;
      if (typeof prop === 'string' && prop.startsWith('RATING_')) return 0;
      if (typeof prop === 'string' && prop.startsWith('REPEAT_')) return 0;
      if (typeof prop === 'string' && prop.startsWith('PITCH_')) return 0;
      if (typeof prop === 'string' && prop.startsWith('APP_KILLED_')) return 0;
      // Return 0 for any other numeric constant
      return 0;
    },
  }
);
