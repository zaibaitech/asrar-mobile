# Background Audio Playback Implementation

## Overview

The app has been migrated from `expo-av` to `react-native-track-player` for proper background audio playback. This enables audio to continue playing when the app is minimized, the screen is locked, or even when the app is killed.

## Why react-native-track-player?

Unlike `expo-av` which runs in the JavaScript thread, `react-native-track-player`:

- ✅ Runs as a **native foreground service** on Android with a persistent notification
- ✅ Integrates with **iOS Control Center** and lock screen controls
- ✅ Survives app minimization, screen lock, and even app kill
- ✅ Keeps play/pause UI synchronized with actual playback state
- ✅ Provides a professional audio experience like Spotify or other music apps

## Architecture

### 1. Core Services

#### TrackPlayerService (`services/TrackPlayerService.ts`)
- Manages Track Player initialization and configuration
- Provides helper functions for playback control
- Handles graceful fallback in Expo Go (where native module isn't available)
- Registers playback service for lock screen/notification controls

#### AdhanAudioService (`services/AdhanAudioService.ts`)
- Plays Adhan (call to prayer) audio using Track Player
- Integrates with notification system
- Handles different Adhan sounds (Mishary, Mecca, Medina, Fajr)
- Supports volume control and preview playback

### 2. Components

#### AudioPlayer (`components/quran/AudioPlayer.tsx`)
- Updated to use Track Player instead of expo-av
- Supports Quran ayah recitation playback
- Automatically handles track changes and queue management
- Provides callbacks for playback state changes

#### NotificationReceivedHandler (`components/NotificationReceivedHandler.tsx`)
- **NEW:** Listens for incoming notifications
- Triggers Adhan audio playback when prayer notifications arrive
- Can be extended for other notification-triggered actions

#### MiniPlayer (`components/MiniPlayer.tsx`)
- **NEW:** Persistent mini player at bottom of screen
- Shows current track information
- Provides play/pause/stop controls
- Automatically appears when audio is playing

### 3. Integration Points

#### App Layout (`app/_layout.tsx`)
- Registers playback service at app startup
- Includes NotificationReceivedHandler to trigger audio
- Can include MiniPlayer for persistent controls

## Configuration

### Android

The app already has the necessary permissions in `app.json`:

```json
"permissions": [
  "android.permission.INTERNET",
  "android.permission.WAKE_LOCK"
]
```

**Key Android Feature:**
- `AppKilledPlaybackBehavior.ContinuePlayback` - Keeps audio playing even after app is swiped away
- Foreground service with notification shows playback controls

### iOS

Background audio mode is already configured in `app.json`:

```json
"UIBackgroundModes": ["audio", "fetch"]
```

This allows:
- Audio playback in background
- Lock screen controls
- Control Center integration

## Usage Examples

### Playing Adhan Audio

```typescript
import { playAdhanAudio } from '@/services/AdhanAudioService';

// Play Adhan for Fajr prayer
await playAdhanAudio(
  'Fajr',           // Prayer name
  'الفجر',          // Arabic name
  true,             // Is Fajr
  settings          // AdhanSettings object
);
```

### Playing Quran Recitation

```tsx
import { AudioPlayer } from '@/components/quran/AudioPlayer';

<AudioPlayer
  audioUrl="https://cdn.com/ayah.mp3"
  ayahNumber={1}
  surahName="Al-Fatiha"
  autoPlay={false}
  onFinished={() => console.log('Playback finished')}
/>
```

### Showing Persistent Mini Player

```tsx
import { MiniPlayer } from '@/components/MiniPlayer';

// In your layout or main screen
<View style={{ flex: 1 }}>
  {/* Your content */}
  <MiniPlayer />
</View>
```

### Direct Track Player Control

```typescript
import TrackPlayer from 'react-native-track-player';

// Play a single track
await TrackPlayer.add({
  id: 'track-1',
  url: 'https://example.com/audio.mp3',
  title: 'Audio Title',
  artist: 'Artist Name',
});
await TrackPlayer.play();

// Pause
await TrackPlayer.pause();

// Stop and clear
await TrackPlayer.stop();
await TrackPlayer.reset();
```

## Event Listeners

Track Player provides events for monitoring playback:

```typescript
import { Event } from 'react-native-track-player';

// Listen to playback state changes
TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
  console.log('Playback state:', event.state);
});

// Listen to track changes
TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
  console.log('Now playing:', event.track);
});

// Listen for queue end
TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
  console.log('Playback finished');
});
```

## Expo Go Limitations

⚠️ **Important:** Track Player requires a development build or production build to work. It will **NOT** work in Expo Go.

The implementation gracefully handles this:
- `isTrackPlayerAvailable` checks if native module is available
- All Track Player calls are guarded with this check
- App continues to work in Expo Go, but background audio won't play

## Development Build

To test background audio:

```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

Or create a development build with EAS:

```bash
eas build --profile development --platform android
eas build --profile development --platform ios
```

## Testing Background Audio

### Android Testing Checklist

1. ✅ Play audio and minimize app → Audio continues
2. ✅ Lock screen → Audio continues, notification shows controls
3. ✅ Swipe app away → Audio continues (with ContinuePlayback)
4. ✅ Tap notification controls → Play/pause works
5. ✅ Volume buttons → Adjusts audio

### iOS Testing Checklist

1. ✅ Play audio and minimize app → Audio continues
2. ✅ Lock screen → Audio continues, lock screen shows controls
3. ✅ Control Center → Shows playback controls
4. ✅ Physical buttons → Volume and play/pause work
5. ✅ Interruptions (call, alarm) → Audio pauses and resumes

## Troubleshooting

### Audio doesn't play in background

**Android:**
- Ensure app is built with EAS (not Expo Go)
- Check `WAKE_LOCK` permission is granted
- Verify foreground service notification appears

**iOS:**
- Verify `audio` background mode is in Info.plist
- Check app has audio focus
- Ensure device is not in low power mode (may restrict background audio)

### Audio stops when app is killed

**Android:**
- Verify `AppKilledPlaybackBehavior.ContinuePlayback` is set
- Some manufacturers (Xiaomi, Huawei) aggressively kill background services - user must whitelist app

**iOS:**
- iOS automatically stops audio when app is killed (by design)
- Audio will continue when app is minimized or screen is locked

### UI shows wrong state

- Track Player state updates are asynchronous
- Use event listeners to keep UI in sync
- Check that you're listening to the correct track ID

## Migration from expo-av

If you have existing code using `expo-av`:

### Before (expo-av)
```typescript
import { Audio } from 'expo-av';

const { sound } = await Audio.Sound.createAsync(
  { uri: audioUrl },
  { shouldPlay: true }
);
await sound.playAsync();
```

### After (Track Player)
```typescript
import TrackPlayer from 'react-native-track-player';
import { setupTrackPlayer } from '@/services/TrackPlayerService';

await setupTrackPlayer();
await TrackPlayer.add({
  id: 'unique-id',
  url: audioUrl,
  title: 'Track Title',
});
await TrackPlayer.play();
```

## Next Steps

Potential enhancements:

1. **Progress Bar:** Add seek bar to MiniPlayer
2. **Playlist Support:** Queue multiple tracks for continuous playback
3. **Speed Control:** Add playback speed adjustment
4. **Sleep Timer:** Auto-stop after specified duration
5. **Download for Offline:** Cache audio files for offline playback
6. **Android Auto:** Support for Android Auto integration
7. **Apple CarPlay:** Support for CarPlay integration

## Documentation

- [react-native-track-player docs](https://react-native-track-player.js.org/)
- [API Reference](https://react-native-track-player.js.org/docs/api/functions/lifecycle)
- [Events Guide](https://react-native-track-player.js.org/docs/api/events)

## Support

For issues or questions:
1. Check if native module is available: `isTrackPlayerAvailable`
2. Verify you're using a development/production build (not Expo Go)
3. Check console logs for error messages
4. Review Track Player documentation for API details
