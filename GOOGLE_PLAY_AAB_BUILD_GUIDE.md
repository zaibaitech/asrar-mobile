# 🤖 Google Play AAB Build Guide

**Status**: ✅ Configured  
**Build Format**: AAB (Android App Bundle)  
**Target**: Google Play Console → Internal Testing

---

## 📋 Configuration Summary

### ✅ What Was Configured

1. **app.json**
   - Added `android.versionCode: 1` (required for Play Store)
   - Existing `version: "1.0.0"` already present

2. **eas.json**
   - `preview` profile: Set to build AAB for internal testing
   - `production` profile: Set to build AAB for production releases
   - `development` profile: Kept as APK for faster local testing

---

## 🚀 Build Commands

### For Internal Testing (Recommended First Step)

```bash
eas build --platform android --profile preview
```

**What this does:**
- Builds an AAB (Android App Bundle)
- Uses `internal` distribution (suitable for testing)
- Output: `.aab` file ready for Google Play Console
- Automatically handles signing via EAS

### For Production Release

```bash
eas build --platform android --profile production
```

**What this does:**
- Builds a production-ready AAB
- Auto-increments `versionCode` with each build
- Output: Play Store–ready `.aab` file

### For Local Development (APK)

```bash
eas build --platform android --profile development
```

**What this does:**
- Builds an APK (faster for testing)
- **NOT** for Play Store upload
- Use for local device testing only

---

## 📦 Upload to Google Play Console

### Step 1: Run the Build

```bash
eas build --platform android --profile preview
```

Wait for the build to complete (usually 10-15 minutes).

### Step 2: Download the AAB

Once complete, EAS will provide a download link. Download the `.aab` file.

### Step 3: Upload to Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app (Asrariya)
3. Navigate to: **Testing** → **Internal testing**
4. Click **Create new release**
5. Upload your `.aab` file
6. Fill in release notes
7. Click **Review release** → **Start rollout to Internal testing**

---

## 🔄 Version Management

### Current Versions

| Field | Value | Location |
|-------|-------|----------|
| `version` | `1.0.0` | `app.json` → `expo.version` |
| `versionCode` | `1` | `app.json` → `expo.android.versionCode` |

### When to Increment

#### Version (`1.0.0`)
- Increment for user-facing releases
- Manual change in `app.json`
- Examples: `1.0.0` → `1.0.1` (patch), `1.1.0` (minor), `2.0.0` (major)

#### versionCode (`1`)
- **MUST increment** for every Play Store upload
- For `preview` builds: Manually increment in `app.json`
- For `production` builds: Auto-incremented by EAS (`autoIncrement: true`)

**Example:**
```json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 2  // ← Increment before next upload
    }
  }
}
```

---

## ⚙️ Build Profiles Explained

### `preview` (Internal Testing)

```json
{
  "preview": {
    "distribution": "internal",
    "android": {
      "buildType": "app-bundle"
    }
  }
}
```

**Use for:**
- Internal testing releases
- Pre-production testing
- QA validation

**Outputs:**
- `.aab` file
- Installable via Google Play Internal Testing

### `production` (Play Store Release)

```json
{
  "production": {
    "autoIncrement": true,
    "android": {
      "buildType": "app-bundle"
    }
  }
}
```

**Use for:**
- Production releases
- Open/Closed testing
- Public Play Store releases

**Features:**
- Auto-increments `versionCode`
- Production-optimized bundle
- Ready for any Play Store track

### `development` (Local Testing Only)

```json
{
  "development": {
    "distribution": "internal",
    "android": {
      "buildType": "apk"
    }
  }
}
```

**Use for:**
- Local device testing
- Faster iteration
- **NOT for Play Store**

**Outputs:**
- `.apk` file (cannot be uploaded to Play Store)

---

## 🔒 Signing & Keystores

**EAS handles signing automatically!**

- No need to manage keystores manually
- EAS creates and securely stores signing credentials
- Consistent signing across builds
- Works for both `preview` and `production` profiles

**First build:**
- EAS will prompt: "Would you like to generate a new Keystore?"
- Choose: **Yes**
- EAS stores it securely for future builds

---

## ✅ Pre-Flight Checklist

Before running `eas build --platform android --profile preview`:

- [ ] EAS CLI installed (`npm install -g eas-cli`)
- [ ] Logged into EAS (`eas login`)
- [ ] Project linked to EAS (`eas init` or check `app.json` → `extra.eas.projectId`)
- [ ] `versionCode` incremented (if uploading a new version)
- [ ] No uncommitted changes (optional, but recommended)

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Check build logs
eas build:list

# View detailed logs for a specific build
eas build:view <build-id>
```

### "Version code X has already been used"

**Problem:** Play Store rejected your upload because `versionCode` wasn't incremented.

**Solution:**
1. Open `app.json`
2. Increment `android.versionCode`: `1` → `2`
3. Rebuild: `eas build --platform android --profile preview`

### Upload Rejected (Signing Issues)

**Problem:** Play Store says signing key doesn't match.

**Solution:**
- Ensure you're using the same EAS account for all builds
- EAS manages keystores consistently
- Contact EAS support if first upload fails

---

## 📊 Build Comparison

| Feature | `development` | `preview` | `production` |
|---------|--------------|-----------|--------------|
| **Output** | APK | AAB | AAB |
| **Play Store** | ❌ No | ✅ Yes | ✅ Yes |
| **Auto-increment** | ❌ No | ❌ No | ✅ Yes |
| **Optimized** | ❌ No | ✅ Yes | ✅ Yes |
| **Speed** | ⚡ Fast | 🐢 Slower | 🐢 Slower |
| **Use case** | Local testing | Internal testing | Production |

---

## 🎯 Quick Reference

### Build for Internal Testing
```bash
eas build --platform android --profile preview
```

### Build for Production
```bash
eas build --platform android --profile production
```

### Check Build Status
```bash
eas build:list
```

### Increment versionCode Manually
Edit `app.json`:
```json
{
  "expo": {
    "android": {
      "versionCode": 2  // ← Change this
    }
  }
}
```

---

## 📚 Resources

| Resource | Link |
|----------|------|
| EAS Build Docs | https://docs.expo.dev/build/introduction/ |
| EAS Build Configuration | https://docs.expo.dev/build/eas-json/ |
| Google Play Upload | https://support.google.com/googleplay/android-developer/answer/9859152 |
| App Versioning | https://docs.expo.dev/build-reference/app-versions/ |
| Internal Testing | https://support.google.com/googleplay/android-developer/answer/9845334 |

---

## ✅ Next Steps

1. **Run your first build:**
   ```bash
   eas build --platform android --profile preview
   ```

2. **Wait for completion** (check status with `eas build:list`)

3. **Download the AAB** from the EAS dashboard or CLI link

4. **Upload to Play Console:**
   - Go to Internal Testing
   - Create new release
   - Upload your `.aab`
   - Add testers
   - Rollout!

5. **Test with testers:**
   - Share internal testing link
   - Collect feedback
   - Iterate!

---

**🎉 You're all set!** Your project is now configured to build Play Store–ready AAB files via EAS.
