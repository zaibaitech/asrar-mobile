# Adhan Sound Fix for EAS Production Builds

## Problem
When building the app with EAS, the Adhan audio doesn't play when prayer time notifications are sent. The notification only vibrates without playing the audio.

## Root Cause
The issue occurs because **Android production builds** require specific configuration that differs from Expo Go:

1. **Missing Notification Channels**: Android requires notification channels to be created with sound configuration
2. **Incorrect Sound Path Format**: Android production builds reference sound files differently than Expo Go
3. **Missing Permissions**: Android 12+ requires specific permissions for exact alarm scheduling
4. **No Channel Assignment**: Notifications weren't assigned to a channel with proper sound settings

## Solution Implemented

### 1. Android Notification Channel Setup
Created a dedicated notification channel for Adhan with these settings:
- **Importance**: MAX (ensures sound plays even in DND mode)
- **Bypass DND**: Enabled (prayer notifications should override Do Not Disturb)
- **Sound**: Configured per notification
- **Vibration**: Pattern [0, 250, 250, 250]
- **Priority**: High visibility

```typescript
await Notifications.setNotificationChannelAsync(ADHAN_CHANNEL_ID, {
  name: 'Prayer Call (Adhan)',
  description: 'Notifications for prayer times with adhan audio',
  importance: Notifications.AndroidImportance.MAX,
  sound: 'default',
  vibrationPattern: [0, 250, 250, 250],
  enableVibrate: true,
  enableLights: true,
  lightColor: '#64B5F6',
  lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  bypassDnd: true,
});
```

### 2. Platform-Specific Sound Path Format
Updated sound file references to use the correct format for each platform:
- **Android Production**: `'adhan_default'` (no extension)
- **iOS/Expo Go**: `'adhan_default.mp3'` (with extension)

```typescript
const sounds = {
  default: Platform.OS === 'android' ? 'adhan_default' : 'adhan_default.mp3',
  mishary: Platform.OS === 'android' ? 'adhan_mishary' : 'adhan_mishary.mp3',
  // etc...
};
```

### 3. Android Permissions Added
Added required permissions to `app.json`:
```json
"permissions": [
  "android.permission.SCHEDULE_EXACT_ALARM",
  "android.permission.USE_EXACT_ALARM"
]
```

These permissions ensure notifications fire at **exact** prayer times on Android 12+.

### 4. Notification Content Updates
Each notification now includes Android-specific configuration:
```typescript
const notificationContent: any = {
  title: `🕌 ${prayer.name} Prayer Time`,
  body: `It's time for ${prayer.name} prayer`,
  sound: soundFile,
  data: { type: 'prayer', prayerName: prayer.name },
};

// Android-specific
if (Platform.OS === 'android') {
  notificationContent.channelId = ADHAN_CHANNEL_ID;
  notificationContent.priority = 'max';
  notificationContent.vibrate = settings.vibrate ? [0, 250, 250, 250] : undefined;
}
```

## Files Modified

### 1. `/services/AdhanNotificationService.ts`
**Changes:**
- ✅ Added Platform import from react-native
- ✅ Created `setupAndroidChannels()` function
- ✅ Updated `initNotifications()` to setup channels on Android
- ✅ Modified `getAdhanSound()` to return platform-specific paths
- ✅ Updated `schedulePrayerNotifications()` to use channel ID and proper sound
- ✅ Updated `sendTestNotification()` to use same configuration

### 2. `/app.json`
**Changes:**
- ✅ Added `android.permission.SCHEDULE_EXACT_ALARM`
- ✅ Added `android.permission.USE_EXACT_ALARM`

## Testing Instructions

### Test in Development
```bash
# 1. Start development server
npx expo start

# 2. In the app, navigate to Prayer Times widget
# 3. Long-press the widget to open Adhan Settings
# 4. Tap "Test Notification"
# 5. Verify sound plays in 2 seconds
```

### Test Production Build
```bash
# 1. Build with EAS
eas build --platform android --profile preview

# 2. Install the APK on your device
# 3. Open the app and grant all permissions
# 4. Go to Adhan Settings
# 5. Tap "Test Notification"
# 6. Verify:
#    - Notification appears
#    - Sound plays (adhan audio)
#    - Vibration works (if enabled)
```

## Expected Behavior After Fix

### ✅ What Should Work Now
1. **Sound Playback**: Adhan audio plays when notification fires
2. **Vibration**: Device vibrates according to settings
3. **Exact Timing**: Notifications fire at exact prayer times
4. **DND Override**: Sound plays even in Do Not Disturb mode (for prayer calls)
5. **Background**: Works when app is closed or in background
6. **Custom Sounds**: Users can select different Adhan sounds
7. **Test Notifications**: Test button plays sound immediately

### 🔧 User Settings Respected
- Volume slider controls adhan volume
- Sound selection (default, Mishary, Mecca, Medina)
- Separate Fajr adhan selection
- Vibration toggle
- Per-prayer enable/disable

## Troubleshooting

### Sound Still Not Playing?

1. **Check Device Volume**
   - Ensure media volume is turned up (not just ringer volume)
   - Test with another media app to confirm speakers work

2. **Check App Permissions**
   - Go to: Settings > Apps > Asrār > Notifications
   - Verify "Prayer Call (Adhan)" channel is enabled
   - Check that sound is enabled for the channel

3. **Check DND Settings**
   - If phone is in Do Not Disturb mode
   - Go to: Settings > Do Not Disturb > Apps
   - Add Asrār to allowed apps

4. **Rebuild the App**
   ```bash
   # Clear build cache and rebuild
   eas build --platform android --profile preview --clear-cache
   ```

5. **Check Sound Files**
   ```bash
   # Verify sound files exist
   ls -lh assets/sounds/
   
   # Should show all 5 MP3 files
   ```

6. **Test Individual Components**
   - Test notification: Use "Test Notification" button in Adhan Settings
   - Test sound separately: Play MP3 files in a music app
   - Check logs: `npx expo start` and watch console for errors

## Technical Notes

### Why Different Sound Paths?
- **Expo Go**: Loads sounds from assets at runtime using full filename
- **Android Production**: Sound files are compiled into `res/raw/` and referenced without extension
- **iOS Production**: Handles both formats but prefers full filename

### Why Notification Channels?
- Required by Android 8.0+ (API level 26)
- Gives users granular control over notification behavior
- Allows system to manage sound, vibration, and importance
- Enables "bypass DND" feature for critical notifications

### Why MAX Importance?
Prayer notifications are time-sensitive and important. MAX importance ensures:
- Sound plays at full volume (respecting user's volume setting)
- Heads-up notification (appears at top of screen)
- Can override Do Not Disturb mode
- Works even with aggressive battery savers

## References

- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Android Notification Channels](https://developer.android.com/develop/ui/views/notifications/channels)
- [Android Exact Alarms](https://developer.android.com/about/versions/12/behavior-changes-12#exact-alarm-permission)

---

**Status**: ✅ Fixed  
**Last Updated**: December 26, 2024  
**Tested On**: Android Production Build (EAS)
