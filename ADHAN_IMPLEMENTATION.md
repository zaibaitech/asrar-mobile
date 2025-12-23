# Adhan Notification System Implementation

## Overview

The Asrār app includes a comprehensive adhan (call to prayer) notification system that automatically schedules and plays the adhan at the correct prayer times based on the user's location.

## Features

### ✅ Core Functionality
- **Automatic Scheduling**: Notifications are automatically scheduled for all 5 daily prayers
- **Location-Based**: Uses the device's location to calculate accurate prayer times via the Aladhan API
- **Background Execution**: Notifications work even when the app is closed or in the background
- **Persistent Settings**: User preferences are saved and persist across app restarts

### 🎵 Audio Features
- **Multiple Adhan Sounds**: Choose from various authentic adhan recordings
- **Different Fajr Adhan**: Separate sound selection for Fajr prayer (traditional longer melody)
- **Volume Control**: Adjustable volume from 0-100%
- **Vibration Support**: Optional vibration with notification

### ⚙️ Customization
- **Per-Prayer Toggle**: Enable/disable notifications for each prayer individually
- **Master Toggle**: Quickly enable/disable all prayer notifications
- **Reminder System**: Optional reminder 5-30 minutes before prayer time
- **Test Notification**: Preview how notifications will appear

## Architecture

### Files Structure

```
/workspaces/asrar-mobile/
├── services/
│   └── AdhanNotificationService.ts       # Core notification logic
├── app/
│   └── adhan-settings.tsx                # Settings screen UI
├── components/home/widgets/
│   └── PrayerTimesWidget.tsx             # Auto-schedules notifications
└── assets/sounds/
    ├── adhan_default.mp3                 # Default adhan
    ├── adhan_mishary.mp3                 # Mishary Rashid Al-Afasy
    ├── adhan_mecca.mp3                   # Mecca adhan
    ├── adhan_medina.mp3                  # Medina adhan
    └── adhan_fajr.mp3                    # Special Fajr adhan
```

### Component Responsibilities

#### AdhanNotificationService
**Location**: `/services/AdhanNotificationService.ts`

**Purpose**: Manages all notification scheduling and configuration logic

**Key Methods**:
```typescript
// Request notification permissions from the user
requestNotificationPermissions(): Promise<boolean>

// Schedule notifications for all enabled prayers
schedulePrayerNotifications(prayerTimings: PrayerTimings): Promise<void>

// Load user settings from storage
loadSettings(): Promise<AdhanSettings>

// Save user settings to storage
saveSettings(settings: AdhanSettings): Promise<void>

// Cancel all scheduled notifications
cancelAllNotifications(): Promise<void>

// Send a test notification
sendTestNotification(settings: AdhanSettings): Promise<void>
```

**AdhanSettings Interface**:
```typescript
interface AdhanSettings {
  enabled: boolean;                    // Master toggle
  volume: number;                      // 0-100
  vibrate: boolean;                    // Vibration on/off
  adhanSound: 'default' | 'mishary' | 'mecca' | 'medina';
  adhanSoundFajr: 'default' | 'mishary' | 'mecca' | 'medina';
  enabledPrayers: {
    Fajr: boolean;
    Dhuhr: boolean;
    Asr: boolean;
    Maghrib: boolean;
    Isha: boolean;
  };
  reminderMinutes: number;             // 0-30 minutes before prayer
}
```

#### Adhan Settings Screen
**Location**: `/app/adhan-settings.tsx`

**Purpose**: Provides UI for users to configure adhan notifications

**Features**:
- Master toggle for all notifications
- Individual toggles for each prayer
- Volume slider (0-100%)
- Vibration toggle
- Adhan sound selection (separate for Fajr and other prayers)
- Reminder time slider (0-30 minutes)
- Test notification button
- Auto-save on all changes

#### Prayer Times Widget
**Location**: `/components/home/widgets/PrayerTimesWidget.tsx`

**Purpose**: Displays next prayer and auto-schedules notifications

**Integration**:
- Automatically schedules notifications when prayer times are loaded
- Long-press widget to open adhan settings
- Shows "Hold to configure" hint text

## User Flow

### Initial Setup
1. App requests notification permissions on first launch
2. User grants permissions
3. Prayer times are fetched based on location
4. Notifications are automatically scheduled for all 5 prayers

### Customization
1. User long-presses the Prayer Times widget
2. Settings screen opens
3. User customizes preferences:
   - Enable/disable specific prayers
   - Adjust volume
   - Select adhan sound
   - Set reminder time
4. Settings auto-save on change
5. Notifications are rescheduled with new settings

### Daily Operation
1. Prayer times update automatically (24-hour cache)
2. Notifications trigger at scheduled times
3. Adhan plays with configured volume
4. Device vibrates if enabled
5. Optional reminder fires before prayer time

## Notification Behavior

### Timing
- **Prayer Time**: Notification fires at exact prayer time
- **Reminder**: Optional notification 5-30 minutes before prayer
- **Auto-Reschedule**: Notifications reschedule daily at midnight

### Sound Selection
- **Fajr**: Uses `adhanSoundFajr` setting (separate from other prayers)
- **Other Prayers**: Uses `adhanSound` setting
- **Fallback**: Default sound if selected sound file is missing

### Notification Content
```
Title: "Time for [Prayer Name]"
Body: "It's time for [Arabic Name] prayer"
Sound: Selected adhan audio
Vibration: Based on user setting
Priority: High
```

## Permission Handling

### iOS
- Requires `UIBackgroundModes` in `Info.plist`: `["audio", "fetch"]`
- Users see native iOS permission prompt
- Can revoke permissions in Settings > Notifications

### Android
- Requires permissions in `AndroidManifest.xml`:
  - `POST_NOTIFICATIONS` (Android 13+)
  - `VIBRATE`
  - `RECEIVE_BOOT_COMPLETED`
  - `WAKE_LOCK`
- Users can revoke in Settings > Apps > Asrār > Notifications

## Background Tasks

The app uses `expo-task-manager` and `expo-background-fetch` to ensure notifications work when the app is closed:

1. **Background Fetch**: Refreshes prayer times once daily
2. **Notification Scheduling**: Schedules up to 64 notifications (iOS limit)
3. **Boot Receiver**: Re-schedules notifications after device restart (Android)

## Testing

### Test Notification
Use the "Test Notification" button in settings to verify:
- Notification appears correctly
- Sound plays at correct volume
- Vibration works (if enabled)
- Notification content is formatted properly

### Manual Testing Checklist
- [ ] Enable/disable master toggle
- [ ] Toggle individual prayers
- [ ] Adjust volume slider (verify sound level)
- [ ] Switch adhan sounds
- [ ] Set different Fajr sound
- [ ] Configure reminder time
- [ ] Test notification appears correctly
- [ ] Close app and verify notification still fires
- [ ] Restart device and verify notifications reschedule
- [ ] Revoke permissions and verify graceful handling

## Troubleshooting

### Notifications Not Appearing
1. **Check Permissions**: Settings > Notifications > Asrār > Allow Notifications
2. **Verify Settings**: Open adhan settings and ensure master toggle is enabled
3. **Check Prayer Toggles**: Ensure specific prayer is enabled
4. **Location Access**: Verify app has location permissions for accurate prayer times
5. **Reinstall**: Uninstall and reinstall app to reset notification permissions

### Sound Not Playing
1. **Volume Level**: Check adhan volume is > 0% in settings
2. **Device Volume**: Verify device media volume is not muted
3. **Audio Files**: Ensure adhan audio files exist in `assets/sounds/`
4. **Sound Selection**: Try switching to different adhan sound
5. **Test Button**: Use "Test Notification" to isolate issue

### Wrong Prayer Times
1. **Location**: Verify location permissions are granted
2. **Internet**: Check internet connection for Aladhan API
3. **Cache**: Prayer times cache for 24 hours - wait or reinstall to refresh
4. **Manual Refresh**: Tap Prayer Times widget to force refresh

### Notifications Stop After Phone Restart
- **Android**: Ensure `RECEIVE_BOOT_COMPLETED` permission is granted
- **iOS**: Re-open app once after restart to reschedule notifications
- **Battery Saver**: Disable battery optimization for Asrār app

## API Dependencies

### Aladhan API
- **Endpoint**: `https://api.aladhan.com/v1/timings`
- **Rate Limit**: None (free tier)
- **Caching**: 24-hour cache to minimize API calls
- **Fallback**: If API fails, notifications use last cached prayer times

### Required Packages
```json
{
  "expo-notifications": "latest",
  "expo-task-manager": "latest",
  "expo-background-fetch": "latest",
  "expo-location": "~19.0.8",
  "@react-native-async-storage/async-storage": "^2.2.0",
  "@react-native-community/slider": "latest"
}
```

## Privacy & Data

### Data Collection
- **Location**: Only used to calculate prayer times, not stored or transmitted
- **Settings**: Stored locally on device via AsyncStorage
- **No Analytics**: No user behavior tracking for adhan feature

### Data Storage
- **AsyncStorage Keys**:
  - `adhan_settings`: User preferences (AdhanSettings object)
  - `prayer_times_cache`: Cached prayer times (24h TTL)
  - `last_notification_schedule`: Timestamp of last scheduling

## Future Enhancements

### Planned Features
- [ ] Custom adhan upload (user's own audio file)
- [ ] Silent mode (notification without sound)
- [ ] Gradual volume increase
- [ ] Qibla direction in notification
- [ ] Prayer time history and analytics
- [ ] Missed prayer tracking
- [ ] Integration with calendar apps
- [ ] Widget for home screen (iOS 14+, Android)

### Community Requests
- [ ] Multiple reminder times (e.g., 10 min and 5 min before)
- [ ] Different reminder sounds
- [ ] Sunrise/Sunset notifications (for fasting)
- [ ] Jumuah (Friday) special notification
- [ ] Eid prayer notifications
- [ ] Automatic DND during prayer time

## Contributing

When adding new adhan sounds:
1. Add MP3 file to `assets/sounds/`
2. Update `AdhanSettings.adhanSound` type in `AdhanNotificationService.ts`
3. Add selection option in `adhan-settings.tsx`
4. Update `app.json` sounds array
5. Test on both iOS and Android
6. Update this documentation

## Support

For issues or feature requests related to adhan notifications:
1. Check this documentation
2. Review troubleshooting section
3. Test with "Test Notification" button
4. Check device notification settings
5. Submit issue with:
   - Device model and OS version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

---

**Last Updated**: 2025-01-XX  
**Version**: 1.0.0  
**Maintainer**: Zaibai Tech
