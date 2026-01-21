# 🚀 Asrariya EAS Build Guide

**Last Updated**: January 19, 2026  
**Build Status**: ✅ Ready

---

## 📋 Project Configuration

| Setting | Value |
|---------|-------|
| **App Name** | Asrariya |
| **Slug** | asrar-mobile |
| **iOS Bundle ID** | `com.zaibaitech.asrariya` |
| **Android Package** | `com.zaibaitech.asrariya` |
| **EAS Project ID** | `92154153-0f9a-4685-b469-75ca8e3ce08b` |
| **Expo SDK** | 54.0.0 |
| **EAS Account** | zaibaitech |

---

## 🔧 Pre-Build Setup (One-Time)

### 1. Verify Configuration
```bash
# Check for any issues
npx expo-doctor

# Verify EAS login
npx eas whoami

# Configure EAS (if needed)
npx eas build:configure --platform all
```

### 2. Key Files
- `app.json` - App configuration (bundle IDs, permissions, plugins)
- `eas.json` - Build profiles (development, preview, production)
- `metro.config.js` - Metro bundler configuration

---

## 🏗️ Build Commands

### Development Build (APK for testing)
```bash
eas build --profile development --platform android
```

### Preview Build (Internal testing)
```bash
eas build --profile preview --platform android
eas build --profile preview --platform ios
eas build --profile preview --platform all
```

### Production Build (App Store release)
```bash
eas build --profile production --platform android
eas build --profile production --platform ios
eas build --profile production --platform all
```

---

## 📱 Build Profiles (eas.json)

| Profile | Purpose | Distribution |
|---------|---------|--------------|
| `development` | Testing on device | Internal (APK) |
| `preview` | Beta testing | Internal |
| `production` | App Store release | Store |

---

## 🔐 Credentials

### Android
- **Keystore**: Auto-generated and stored on EAS servers
- **First build**: Select "Y" when prompted to generate new keystore

### iOS (when building)
- **Certificates**: Managed by EAS
- **Provisioning Profiles**: Auto-generated

---

## ✅ Pre-Build Checklist

- [ ] Run `npx expo-doctor` - All 17 checks pass
- [ ] Verify `npx eas whoami` shows correct account
- [ ] Check `app.json` has correct bundle IDs
- [ ] Ensure `.env` has required keys (Supabase, Groq)
- [ ] No TypeScript errors: `npx tsc --noEmit`

---

## 📲 After Build

### Download APK
1. Check build status: `eas build:list`
2. Download from EAS dashboard: [expo.dev/accounts/zaibaitech](https://expo.dev/accounts/zaibaitech)
3. Or use direct link from build output

### Install on Device
```bash
# Install directly via ADB
adb install path/to/app.apk
```

### Submit to Stores
```bash
# After production build
eas submit --platform android
eas submit --platform ios
```

---

## 🐛 Troubleshooting

### "Slug mismatch" Error
Ensure `slug` in `app.json` matches the EAS project slug.

### Package Version Issues
```bash
npx expo install --fix
```

### Schema Validation Errors
Check `app.json` for deprecated/invalid fields. Run `npx expo-doctor` for details.

### Build Queue
Check status at: https://expo.dev/accounts/zaibaitech/projects/asrar-mobile/builds

---

## 📁 Product IDs (for RevenueCat)

| Product | ID |
|---------|-----|
| Monthly | `asrariya_premium_monthly` |
| Yearly | `asrariya_premium_yearly` |
| Lifetime | `asrariya_premium_lifetime` |

---

## 🔗 Useful Links

- [EAS Dashboard](https://expo.dev/accounts/zaibaitech)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)
