# Adhan Sound Testing Guide

## 🔴 CRITICAL: Expo Go Limitation

**Custom notification sounds DO NOT work in Expo Go!**

When you click "Test Notification" in Expo Go, you will only hear:
- ✅ **Default phone notification sound** (system sound)
- ✅ **Vibration** (if enabled)
- ❌ **Custom adhan audio** (NOT supported in Expo Go)

This is **NOT a bug** - it's a known Expo Go limitation.

## ✅ How to Test Custom Adhan Audio

To hear the actual adhan audio, you must use an **EAS Build**:

### Option 1: EAS Development Build (Recommended for Testing)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to your Expo account
eas login

# Create a development build for Android
eas build --profile development --platform android

# Or for iOS
eas build --profile development --platform ios
```

### Option 2: EAS Preview Build
```bash
# Build a preview version
eas build --profile preview --platform android
```

### Option 3: Production Build
```bash
# Build production APK/AAB
eas build --profile production --platform android
```

## 📱 Testing Steps

### 1. In Expo Go (Limited Testing)
```bash
npx expo start --tunnel
```
- Can test: notification scheduling, basic functionality
- Cannot test: custom adhan audio
- Will see: system default notification sound only

### 2. In EAS Development Build (Full Testing)
1. Build the app with EAS (see commands above)
2. Install the APK/IPA on your device
3. Open the app
4. Go to **Adhan Settings**
5. Click **"Test Notification"** button
6. Wait 2 seconds
7. You should hear the **actual adhan audio** 🎵

## 🔍 Debug Logs

When testing, check the console logs:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔔 SENDING TEST NOTIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Platform: android
Sound file: adhan_default
Play sound: true
Vibrate: true
Channel ID: adhan-notifications
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Test notification scheduled for 2 seconds from now
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🎵 Available Adhan Sounds

All sound files are located in `assets/sounds/`:

- `adhan_default.mp3` - Default adhan (656 KB)
- `adhan_fajr.mp3` - Fajr prayer adhan (959 KB)  
- `adhan_mishary.mp3` - Mishary Rashid (656 KB)
- `adhan_mecca.mp3` - Mecca adhan (821 KB)
- `adhan_medina.mp3` - Medina adhan (959 KB)

## ⚙️ Technical Details

### Sound File Path Format

**Android EAS Build:**
```typescript
sound: 'adhan_default'  // No .mp3 extension
```

**iOS EAS Build:**
```typescript
sound: 'adhan_default.mp3'  // With .mp3 extension
```

**Expo Go:**
```typescript
sound: 'default'  // System default only
```

### Android Notification Channel

The app creates a high-priority notification channel:

```typescript
{
  name: 'Prayer Call (Adhan)',
  importance: MAX,
  sound: 'default',
  bypassDnd: true,
  vibrationPattern: [0, 250, 250, 250]
}
```

## 🐛 Troubleshooting

### "No sound plays in Expo Go"
✅ **Expected behavior** - Use EAS build instead

### "Sound plays but wrong audio"
1. Check your settings in **Adhan Settings** screen
2. Verify the sound file selection (Fajr vs Other prayers)
3. Check console logs for sound file path

### "Notification doesn't appear at all"
1. Check notification permissions (Settings > Apps > Asrar)
2. Make sure "Play sound" is enabled in Adhan Settings
3. Verify notification scheduling in console logs

### "Sound plays in EAS build but very quiet"
1. Go to **Adhan Settings**
2. Increase the **Volume** slider (0-100%)
3. Also check phone's notification volume

## 📋 Checklist for Custom Sound Testing

- [ ] Created EAS development build
- [ ] Installed build on physical device
- [ ] Opened app and granted notification permissions
- [ ] Navigated to Adhan Settings
- [ ] Enabled "Play sound" toggle
- [ ] Selected desired adhan (default/mishary/mecca/medina)
- [ ] Clicked "Test Notification" button
- [ ] Waited 2 seconds
- [ ] Heard custom adhan audio (not system sound)

## 📚 References

- [Expo Notifications Docs](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Custom Notification Sounds](https://docs.expo.dev/versions/latest/sdk/notifications/#playing-sounds)

---

**Summary:** Custom adhan audio works perfectly in EAS builds but is NOT supported in Expo Go. This is a platform limitation, not a bug in our implementation.
