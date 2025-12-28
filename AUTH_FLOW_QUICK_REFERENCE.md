# 🚀 Authentication Flow - Quick Reference

## 📱 New User Flow

```
1. Sign Up Screen
   ├─> Enter email + password
   ├─> Tap "Create Account"
   └─> ✅ Navigate to Email Verification screen

2. Email Verification Screen  
   ├─> Shows user's email
   ├─> Instructions displayed
   ├─> User checks email
   └─> Tap verification link

3. Email Link Clicked
   ├─> Deep link opens app
   ├─> Profile check runs
   ├─> No profile data?
   │   └─> Alert + Navigate to Profile screen
   └─> Has profile data?
       └─> Alert + Navigate to Home

4. Profile Screen (if needed)
   ├─> User enters name, DOB, etc.
   └─> Navigate to Home
```

## 🔧 Testing Commands

### Test Deep Link (Android)
```bash
adb shell am start -W -a android.intent.action.VIEW \
  -d "asrar://auth/callback?type=signup&access_token=test&refresh_token=test"
```

### Test Deep Link (iOS Simulator)
```bash
xcrun simctl openurl booted \
  "asrar://auth/callback?type=signup&access_token=test&refresh_token=test"
```

### Rebuild App (Required!)
```bash
# Clean rebuild (for deep linking changes)
npx expo prebuild --clean

# Run Android
npx expo run:android

# Run iOS
npx expo run:ios
```

## ⚙️ Supabase Configuration

### 1. Email Template
**Dashboard:** Authentication → Email Templates → "Confirm signup"

**Replace:**
```html
<a href="{{ .ConfirmationURL }}">Confirm your email</a>
```

**With:**
```html
<a href="asrar://auth/callback?access_token={{ .Token }}&refresh_token={{ .RefreshToken }}&type=signup">Confirm your email</a>
```

### 2. Redirect URLs
**Dashboard:** Authentication → URL Configuration

**Add:**
```
asrar://auth/callback
http://localhost:8081/auth/callback
https://asrar.app/auth/callback
```

## 📁 Files Changed

| File | What Changed |
|------|-------------|
| `app/auth.tsx` | Fixed error handling, added error helper |
| `app/email-verification.tsx` | **NEW** - Verification screen |
| `app/_layout.tsx` | Added deep link handler |
| `app.json` | Configured Android/iOS deep linking |
| `services/AuthService.ts` | Added emailRedirectTo parameter |

## 🧪 Quick Tests

### ✅ Test Sign Up Error Fix
1. Go to Sign Up tab
2. Enter new email + password
3. Tap "Create Account"
4. **Expected:** Navigate to verification screen (no error!)

### ✅ Test Resend Email
1. On verification screen
2. Tap "Resend Email"
3. **Expected:** Countdown shows "Resend in 60s"

### ✅ Test Back Button
1. On verification screen
2. Tap "← Back to Sign In"
3. **Expected:** Return to auth screen

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Deep links don't work | Must use dev build, not Expo Go |
| "Backend not configured" | Check `.env` has Supabase credentials |
| Email not sending | Configure SMTP in Supabase dashboard |
| TypeScript errors | Run `npx expo prebuild` again |

## ⚡ Next Session Commands

```bash
# Start development
npm start

# Clear cache if needed
npm start -- --clear

# Check logs
npx react-native log-android
npx react-native log-ios
```

## 📊 Implementation Status

- ✅ Phase 1: Sign-up error fixed
- ✅ Phase 2: Email verification screen
- ✅ Phase 3: Deep linking configured
- ✅ Phase 4: Profile flow implemented

**Status:** Ready for testing! 🎉

---

*Quick reference for AUTH_FLOW_IMPLEMENTATION_COMPLETE.md*
