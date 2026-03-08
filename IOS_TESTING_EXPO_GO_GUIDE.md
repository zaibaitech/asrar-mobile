# 📱 iOS Testing with Expo Go - Quick Start Guide

## Overview

This guide will help you test **Asrariya** on iOS devices using Expo Go - the fastest way to test your app without needing Xcode or building a native app.

## Prerequisites

### On Your iOS Device (iPhone/iPad)

1. **Install Expo Go** from the App Store
   - Open App Store on your iPhone/iPad
   - Search for "Expo Go"
   - Install the free Expo Go app
   - Requires iOS 13.4 or newer

2. **Connect to Same Network**
   - Ensure your iOS device is on the **same WiFi network** as your development machine
   - Important: Some corporate/public WiFi networks block device-to-device communication

### On Your Development Machine

✅ Already configured in this workspace:
- Expo SDK 54 installed
- iOS bundle identifier: `com.zaibaitech.asrariya`
- Deep linking scheme: `asrariya://`

## 🚀 Quick Start

### Option 1: QR Code (Recommended for iOS)

1. **Start the development server:**
   ```bash
   npm start
   # or
   expo start
   ```

2. **Scan the QR code on iPhone:**
   - **Use your iPhone's native Camera app** (not Expo Go!)
   - Point the camera at the QR code displayed in your terminal
   - A notification banner will appear: "Open in Expo Go"
   - Tap the notification to launch the app in Expo Go
   
   **Note:** Recent Expo Go versions on iOS removed the built-in QR scanner. Always use the native Camera app instead.

### Option 2: Tunnel Mode (Works Across Different Networks)

**Best for:** Testing from different networks, remote devices, or when same WiFi isn't available

1. **Start with tunnel mode** (works on both Android & iOS):
   ```bash
   npm start -- --tunnel
   # or
   expo start --tunnel
   ```

2. **Scan the QR code or share the URL:**
   - **iOS:** Use iPhURL Entry

1. **Start the server:**
   ```bash
   npm start
   # Note the exp:// URL in the terminal output
   ```

2. **In Expo Go app on iOS:**
   - Open Expo Go app
   - Tap "Enter URL manually" at the bottom
   - Type the `exp://` address shown in terminal
   - Example: `exp://192.168.1.100:8081`
   - Tap "Connect"
   ```

2. **In Expo Go app:**
   - Tap "Enter URL manually"
   - Type the LAN address shown in terminal
   - Example: `exp://192.168.1.100:8081`

## 🧪 Testing Workflow

### First Launch Checklist

- [ ] App loads without crashes
- [ ] Splash screen displays correctly
- [ ] Auth screen appears (if not logged in)
- [ ] Dark theme renders properly
- [ ] Fonts load correctly

### Core Features to Test on iOS

#### 1. **Authentication Flow**
- [ ] Email/password sign up
- [ ] Email verification (deep link: `asrariya://auth/callback`)
- [ ] Google OAuth (requires iOS-specific setup)
- [ ] Password reset flow
- [ ] Biometric authentication (Face ID/Touch ID)

#### 2. **Deep Linking**
- [ ] Email verification links open in app
- [ ] Password reset links work
- [ ] Web links (`https://asrar.app`) redirect to app

#### 3. **iOS-Specific Features**
- [ ] Audio playback (Adhan, Basmalah)
- [ ] Background audio modes
- [ ] Background fetch for prayer times
- [ ] Notifications
- [ ] Location services
- [ ] Haptic feedback

#### 4. **Performance**
- [ ] Smooth animations (60 FPS)
- [ ] Calculator renders quickly
- [ ] No lag in tab navigation
- [ ] Image loading performance

#### 5. **Layout & UI**
- [ ] Safe area insets (notch/Dynamic Island)
- [ ] Status bar color/style
- [ ] Keyboard behavior
- [ ] Arabic text rendering (RTL)
- [ ] Responsive layout on different screen sizes
 on iPhone

**Problem:** QR scanner doesn't recognize code  
**Solutions:**
1. **Use iPhone's native Camera app**, not Expo Go's scanner (Expo Go removed built-in scanner)
2. Ensure Camera app has permission to access camera
3. Try tunnel mode: `npm start -- --tunnel`
4. Manually enter URL in Expo Go: Open Expo Go → "Enter URL manually"
5. Make sure the QR code is fully visible and well-lit
1. Try `expo start --tunnel` instead
2. Ensure camera permissions are enabled
3. Manually enter URL in Expo Go

### "Unable to Connect to Development Server"

**Problem:** Network connection issue  
**Solutions:**
1. Verify both devices on same WiFi
2. Disable VPN on development machine
3. Try tunnel mode: `expo start --tunnel`
4. Check firewall settings

### App Crashes on Launch

**Problem:** Native module incompatibility  
**Solutions:**
1. Clear Expo Go cache: Shake device → "Clear Expo Go cache"
2. Restart development server
3. Check console for errors: `r` to reload

### Deep Links Not Working

**Problem:** `asrariya://` links don't open app  
**Solutions:**
1. Deep links only work in **standalone builds**, not Expo Go
2. For testing, use the callback screen manually: Navigate to `/auth/callback?access_token=...`
3. Build development client for full deep linking

### Audio Not Playing

**Problem:** Adhan/Basmalah sounds don't play  
**Solutions:**
1. Check iOS silent/ringer switch (physical switch on device)
2. Ensure volume is up
3. Verify `UIBackgroundModes: audio` in app.json (✅ already configured)

## 📊 iOS Device Testing Matrix

| Device | Screen Size | Safe Area | Testing Priority |
|--------|-------------|-----------|------------------|
| iPhone SE (2020+) | 4.7" | Minimal | Medium |
| iPhone 12/13/14 | 6.1" | Notch | High |
| iPhone 14 Pro+ | 6.7" | Dynamic Island | High |
| iPad Air/Pro | 10.9"+ | Large canvas | Low |

**Recommendation:** Test on at least one notched iPhone (12+) and one standard iPhone.

## 🔍 Debugging Tools

### In-App Dev Menu

**Access:** Shake device or press `Cmd+D` (iOS Simulator)

**Options:**
- **Reload:** Refresh app (or press `r` in terminal)
- **Debug Remote JS:** Chrome DevTools debugging
- **Toggle Performance Monitor:** FPS/memory overlay
- **Toggle Inspector:** Element inspector
- **Disable Fast Refresh:** Manual reload only

### Console Logs

**View in Terminal:**
```bash
# Start with logs visible
expo start

# Press 'i' to show iOS logs
```

**Filter logs:**
```bash
# Show only your app's console.log()
expo start | grep "\[asrar"
```

### React DevTools

```bash
# Install globally
npm install -g react-devtools

# Run in separate terminal
react-devtools

# In Expo: Shake device → "Open React DevTools"
```

## 🚨 Limitations of Expo Go

Expo Go **cannot test** these features (require custom development build):

❌ Push notifications (local notifications work)  
❌ Custom native modules  
❌ Deep linking from external apps  
❌ Universal/Associated Domains  
❌ App Store sign-in flows  
❌ Background location (extensive)

For these features, you'll need: **`expo prebuild` + EAS Build** or local iOS build.

## ✅ When Expo Go Testing is Complete

After validating core functionality in Expo Go:

1. **Build development client:**
   ```bash
   eas build --profile development --platform ios
   ```

2. **Install on device** via TestFlight or direct install

3. **Test deep linking & notifications** with real build

4. **Submit to App Store Connect** when ready

## 📱 Current iOS Configuration

**Bundle ID:** `com.zaibaitech.asrariya`  
**Scheme:** `asrariya://`  
**Display Name:** Asrariya  
**Orientation:** Portrait only  
**Background Modes:** Audio, Fetch  
**Associated Domain:** `applinks:asrar.app`  
**Minimum iOS Version:** 13.4+  

## 🎯 Next Steps

1. ✅ Start development server: `npm start`
2. ✅ Scan QR code with Expo Go
3. ✅ Test authentication flow
4. ✅ Test core features (calculator, prayer times, compatibility)
5. ✅ Verify Arabic text rendering
6. ✅ Test audio playback
7. ⏳ Report any iOS-specific issues
8. ⏳ Build custom development client for advanced features

## 📞 Quick Reference Commands

```bash
# Start normal mode (LAN)
npm start

# Start with tunnel (remote)
expo start --tunnel

# Start and open iOS simulator (requires macOS + Xcode)
npm run ios

# Clear cache and restart
expo start --clear

# View diagnostics
expo doctor

# Update dependencies
expo install --fix
```

---

**Ready to start?** Run `npm start` and scan the QR code with Expo Go! 🚀
