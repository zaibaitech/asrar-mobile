# Background Audio Quick Start Guide

## 🎯 What Changed

Your app now uses **react-native-track-player** instead of expo-av for audio playback. This means:

✅ Adhan audio **continues playing** when the app is minimized  
✅ Audio **continues playing** when the screen is locked  
✅ Audio **shows controls** on the lock screen and in notifications  
✅ On Android, audio can **continue even after app is killed** (configurable)

## 🚀 Quick Implementation

### 1. Playing Adhan When Notification Fires

This happens **automatically** now! The `NotificationReceivedHandler` listens for prayer notifications and plays the Adhan.

```typescript
// Already implemented in NotificationReceivedHandler.tsx
// When prayer notification arrives → Adhan plays automatically
```

### 2. Playing Quran Recitation

The `AudioPlayer` component is already updated:

```tsx
import { AudioPlayer } from '@/components/quran/AudioPlayer';

<AudioPlayer
  audioUrl="https://cdn.com/verse.mp3"
  ayahNumber={1}
  surahName="Al-Fatiha"  // Optional but recommended
  autoPlay={false}
/>
```

### 3. Show Persistent Mini Player (Optional)

Add to your tab layout to show playback controls at the bottom:

```tsx
import { MiniPlayer } from '@/components/MiniPlayer';

// In your tab layout
<View style={{ flex: 1 }}>
  {/* Your tab content */}
  <MiniPlayer />
</View>
```

## 📱 Testing

### ⚠️ Important: Expo Go Won't Work

Track Player requires a **development or production build**:

```bash
# Build development version
npx expo run:android
# or
npx expo run:ios

# Or use EAS
eas build --profile development --platform android
```

### Testing Checklist

**Android:**
1. Play Adhan → minimize app → ✅ audio continues
2. Lock screen → ✅ notification shows with controls
3. Swipe app away → ✅ audio continues (foreground service)
4. Tap notification → ✅ controls work

**iOS:**
1. Play Adhan → minimize app → ✅ audio continues
2. Lock screen → ✅ lock screen shows controls
3. Control Center → ✅ playback controls appear
4. Kill app → ⚠️ audio stops (iOS limitation)

## 🔧 Configuration

All configuration is already done in:
- ✅ `app.json` - iOS background modes + Android permissions
- ✅ `service.js` - Track Player event handlers
- ✅ `package.json` - Service registration
- ✅ `app/_layout.tsx` - Playback service registration

## 📁 New Files

```
services/
  ├── AdhanAudioService.ts          # Plays Adhan using Track Player
  └── TrackPlayerService.ts         # (Already existed)

components/
  ├── NotificationReceivedHandler.tsx  # Triggers audio on notification
  └── MiniPlayer.tsx                   # Persistent playback controls

service.js                           # Track Player service registration
```

## 🎛️ Advanced Usage

### Direct Control

```typescript
import TrackPlayer from 'react-native-track-player';

// Play audio
await TrackPlayer.play();

// Pause
await TrackPlayer.pause();

// Stop and clear queue
await TrackPlayer.stop();
await TrackPlayer.reset();

// Get current track
const track = await TrackPlayer.getActiveTrack();

// Check if playing
const state = await TrackPlayer.getPlaybackState();
const playing = state.state === State.Playing;
```

### Listen to Events

```typescript
import { Event } from 'react-native-track-player';

// Track changes
TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
  console.log('Now playing:', event.track);
});

// Playback state
TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
  console.log('State:', event.state);
});

// Queue ended
TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
  console.log('Playback finished');
});
```

## 🐛 Troubleshooting

### Audio doesn't play

**Check 1:** Are you using a development/production build? (Not Expo Go)
**Check 2:** Check console for errors
**Check 3:** Verify Track Player is available:

```typescript
import { isTrackPlayerAvailable } from '@/services/TrackPlayerService';

if (!isTrackPlayerAvailable) {
  console.warn('Track Player not available - using Expo Go?');
}
```

### Audio stops when minimized

**iOS:** Check `app.json` has `"audio"` in `UIBackgroundModes`  
**Android:** Ensure app is built with EAS (not Expo Go)

### Notification doesn't play audio

**Check:** Is `NotificationReceivedHandler` added to `_layout.tsx`? ✅ (Already done)  
**Check:** Are Adhan sounds in `assets/sounds/`? ✅ (Already there)  
**Check:** Is notification category set to `"prayer"`? ✅ (Yes in AdhanNotificationService)

## 📚 Full Documentation

See [BACKGROUND_AUDIO_IMPLEMENTATION.md](./BACKGROUND_AUDIO_IMPLEMENTATION.md) for complete details.

## 🎉 You're Ready!

Just build the app with a development or production build and test audio playback. The notification handler will automatically play Adhan when prayer times arrive!
