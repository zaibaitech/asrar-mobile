# ⚡ Ready to Test - Action Items

## 🎯 Before You Can Test (REQUIRED)

### 1. Rebuild Your App (CRITICAL!)
Deep linking requires native code changes. You MUST rebuild:

```bash
# Clean rebuild
npx expo prebuild --clean

# Then run on your platform:
npx expo run:android
# OR
npx expo run:ios
```

**⚠️ WARNING:** 
- Won't work in Expo Go!
- Must use development build or production build
- If you skip this, deep links will NOT work

---

### 2. Configure Supabase Email Template (REQUIRED)

#### Step-by-Step:
1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to: **Authentication** → **Email Templates**
4. Click: **Confirm signup**
5. Find this line:
   ```html
   <a href="{{ .ConfirmationURL }}">Confirm your email</a>
   ```
6. Replace it with:
   ```html
   <a href="asrariya://auth/callback?access_token={{ .Token }}&refresh_token={{ .RefreshToken }}&type=signup">Confirm your email</a>
   ```
7. Click **Save**

---

### 3. Whitelist Redirect URLs (REQUIRED)

#### Step-by-Step:
1. Still in Supabase Dashboard
2. Go to: **Authentication** → **URL Configuration**
3. Under **Redirect URLs**, add:
   ```
   asrariya://auth/callback
   http://localhost:8081/auth/callback
   ```
4. Click **Save**

---

## ✅ Optional But Recommended

### Check Your Environment Variables
Make sure `.env` has:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

If you just added/changed these, restart your dev server:
```bash
npm start -- --clear
```

---

## 🧪 Testing Checklist

Once you've completed the required steps above, test in this order:

### Test 1: Basic Sign Up Flow ✅
```
1. Open rebuilt app
2. Tap "Sign Up" tab
3. Enter: test@example.com / password123 / password123
4. Tap "Create Account"

Expected:
✅ Navigate to email verification screen (no error!)
✅ Screen shows your email address
✅ "Resend Email" button visible
```

### Test 2: Email Verification Screen ✅
```
1. On verification screen
2. Tap "Resend Email"

Expected:
✅ Button disabled for 60 seconds
✅ Shows countdown: "Resend in 59s..."
✅ Alert: "✅ Email Sent!"

3. Tap "← Back to Sign In"

Expected:
✅ Navigate back to auth screen
```

### Test 3: Deep Link (Manual) 🧪
```
1. Get verification email (check spam folder!)
2. Open email on your test device
3. Tap verification link

Expected:
✅ App opens (not browser!)
✅ Alert appears with instructions
✅ Navigate to profile screen or home
```

### Test 4: Deep Link (Command Line) 🧪

**Android:**
```bash
adb shell am start -W -a android.intent.action.VIEW \
   -d "asrariya://auth/callback?type=signup&access_token=test&refresh_token=test"
```

**iOS Simulator:**
```bash
xcrun simctl openurl booted \
   "asrariya://auth/callback?type=signup&access_token=test&refresh_token=test"
```

**Expected:**
✅ App opens
✅ Alert shows next steps

### Test 5: Error Handling ✅
```
Test existing email:
1. Try signing up with existing email

Expected:
✅ Alert: "This email is already registered. Try signing in instead."

Test weak password:
2. Try password: "123"

Expected:
✅ Alert: "Password must be at least 6 characters."
```

---

## 🐛 Troubleshooting

### Problem: "Backend not configured" message
**Check:**
- [ ] `.env` file exists in project root
- [ ] Contains `EXPO_PUBLIC_SUPABASE_URL`
- [ ] Contains `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Restarted dev server after adding them

**Fix:**
```bash
# Stop dev server (Ctrl+C)
npm start -- --clear
```

### Problem: Deep links don't work
**Check:**
- [ ] Did you run `npx expo prebuild --clean`?
- [ ] Did you run `npx expo run:android` (not just `npm start`)?
- [ ] Are you testing on a real device or simulator (not Expo Go)?
- [ ] Is the app.json configured correctly?

**Fix:**
```bash
# Rebuild completely
npx expo prebuild --clean
npx expo run:android
```

### Problem: Email not sending
**Check:**
- [ ] Supabase email settings configured
- [ ] SMTP enabled in Supabase
- [ ] Email not in spam folder
- [ ] Email rate limits not exceeded

**Fix:** Check Supabase Dashboard → Settings → Email

### Problem: TypeScript errors
**Check:**
- [ ] All files saved
- [ ] No syntax errors

**Fix:**
```bash
# Restart TypeScript server in VS Code
# Press: Ctrl+Shift+P
# Type: "TypeScript: Restart TS Server"
```

---

## 📱 Build Status

Before testing, ensure you have:

✅ Modified Files:
- [x] app/auth.tsx
- [x] app/_layout.tsx
- [x] app.json
- [x] services/AuthService.ts

✅ Created Files:
- [x] app/email-verification.tsx

✅ Backend Configuration:
- [ ] Supabase email template updated ← **DO THIS NOW**
- [ ] Redirect URLs whitelisted ← **DO THIS NOW**

✅ App Rebuild:
- [ ] Ran `npx expo prebuild --clean` ← **DO THIS NOW**
- [ ] Ran `npx expo run:android/ios` ← **DO THIS NOW**

---

## 🎉 When Everything Works

You should see this flow:
```
1. Sign up → Email verification screen ✅
2. Check email → Tap link ✅
3. App opens → Alert appears ✅
4. Navigate to profile or home ✅
```

---

## 📞 Need Help?

If you encounter issues:

1. **Check Console Logs**
   ```bash
   # Android
   npx react-native log-android
   
   # iOS
   npx react-native log-ios
   ```

2. **Look for these messages:**
   - `📱 Deep link received: asrariya://...`
   - `✅ Email verified! Processing...`
   - `❌ Auth callback error: ...`

3. **Common Solutions:**
   - Clear app data and reinstall
   - Check Supabase logs for email delivery
   - Verify deep link configuration in app.json

---

## 🚀 Next Steps After Testing

Once everything works:

1. **Production Build**
   ```bash
   eas build --platform android
   eas build --platform ios
   ```

2. **Optional Enhancements**
   - Add password reset flow
   - Add social authentication
   - Add profile completion progress bar

3. **Deploy**
   - Submit to Google Play Store
   - Submit to Apple App Store

---

*Last updated: December 28, 2025*
*Implementation: Complete ✅*
*Status: Ready for testing after configuration*
