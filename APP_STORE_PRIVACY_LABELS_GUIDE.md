# 📋 App Store Privacy Labels & Data Safety Guide
**Last Updated:** January 3, 2026  
**Purpose:** Console configuration for App Store Connect and Google Play Console

---

## 🍎 Apple App Store Connect - App Privacy

**Location:** App Store Connect → Your App → App Privacy

### Step 1: Data Collection Overview

**Question:** Does your app collect data?  
**Answer:** ✅ **YES** (but varies by mode)

---

### Step 2: Data Types Collected

#### 📧 Contact Info
- **Email Addresses**
  - ✅ Collected in **Account Mode** only
  - ❌ Not collected in **Guest Mode**
  - **Purpose:** Account creation and authentication
  - **Linked to user:** Yes
  - **Used for tracking:** No

#### 👤 User Content
- **Other User Content** (AI processing)
  - ✅ Collected in both modes
  - **What:** Arabic names, dates of birth, mother's names (optional)
  - **Purpose:** App functionality (Ilm al-Huruf calculations, Divine Timing)
  - **Linked to user:** Yes (Account) / No (Guest)
  - **Used for tracking:** No
  - **Note:** Processed by Groq AI for Islamic guidance

#### 📍 Location (Optional)
- **Coarse Location**
  - ✅ Optional (for prayer times only)
  - **Purpose:** Prayer time calculations
  - **Linked to user:** Yes (Account) / No (Guest)
  - **Used for tracking:** No
  - **Permission:** User must grant

#### 🆔 Identifiers (AdMob)
- **Advertising Identifier**
  - ✅ Collected automatically by AdMob
  - **Purpose:** Ad personalization and measurement
  - **Linked to user:** No (AdMob handles this)
  - **Used for tracking:** Yes (by Google AdMob)
  - **Control:** Users can reset in device settings

#### 📊 Usage Data (Minimal)
- **Product Interaction**
  - ✅ Ad impressions and clicks (via AdMob)
  - **Note:** AdMob collects ad interaction data automatically

---

### Step 3: Data Usage Purposes

For each data type collected, select:

#### Email Address:
- ✅ **App Functionality** (authentication)
- ❌ Developer's Advertising
- ❌ Third-Party Advertising
- ❌ Analytics

#### User Content (Names, DOB):
- ✅ **App Functionality** (personalization, calculations)
- ❌ Developer's Advertising
- ❌ Third-Party Advertising
- ❌ Analytics

#### Location:
- ✅ **App Functionality** (prayer times)
- ❌ Developer's Advertising
- ❌ Third-Party Advertising
- ❌ Analytics

#### Advertising Identifier:
- ❌ App Functionality
- ❌ Developer's Advertising
- ✅ **Third-Party Advertising** (Google AdMob)
- ❌ Analytics

---

### Step 4: Third-Party Data Sharing

**Question:** Do you share data with third parties?  
**Answer:** ⚠️ **YES** (but only for functionality)

**Third Parties:**

1. **Supabase** (Authentication & Storage - Account Mode Only)
   - Email addresses
   - User profile data (when synced)
   - **Purpose:** Authentication and cloud backup
   - **Link:** https://supabase.com/privacy

2. **Groq AI** (AI Processing)
   - User names (Arabic)
   - Birth dates
   - User questions/prompts
   - **Purpose:** Islamic guidance generation
   - **Link:** https://groq.com/privacy-policy/
   - **Note:** No data retention after processing

**Important:** Make clear that:
- Guest mode = **No cloud sync, local only**
- Account mode = **Optional cloud backup via Supabase**
- AI processing = **Groq for guidance, not for tracking**

---

### Step 5: Data Retention & Deletion

**Retention:**
- Guest mode: Stored locally until user clears data
- Account mode: Stored in Supabase until account deletion

**Deletion:**
- ✅ Users can delete data through in-app settings
- ✅ Account deletion available (Profile → Privacy & Data → Delete Account)
- ✅ Data export available (JSON format)

---

### Step 6: Privacy Policy URL

**Privacy Policy:** `https://zaibaitech.github.io/asrar-mobile/privacy.html`

---

## 🤖 Google Play Console - Data Safety

**Location:** Google Play Console → App Content → Data Safety

---

## ⚠️ CRITICAL: Ads Declaration

**Location:** Google Play Console → App Content → Ads

### Question: Does your app contain ads?
**Answer:** ✅ **YES**

**Why:** Your app uses `react-native-google-mobile-ads` (AdMob)

**Important:** 
- Failing to declare ads = instant rejection
- Must match the actual implementation
- AdMob collects device identifiers automatically

---

### Step 1: Data Collection & Security

**Does your app collect or share user data?**  
✅ **YES**

**Is all user data encrypted in transit?**  
✅ **YES** (HTTPS for all API calls)

**Do you provide a way for users to request data deletion?**  
✅ **YES** (in-app deletion via Profile screen)

---

### Step 2: Data Types & Purposes

#### Device or Other IDs
- **Advertising ID**
  - ✅ Collected (by Google AdMob)
  - **Why:** Advertising or marketing
  - **Optional:** No (automatic)
  - **Ephemeral:** No

#### Personal Info
- **Name**
  - ✅ Collected
  - **Why:** App functionality (Ilm al-Huruf calculations)
  - **Optional:** No (required for personalization)
  - **Ephemeral:** No
  
- **Email Address** (Account Mode Only)
  - ✅ Collected
  - **Why:** Account management
  - **Optional:** Yes (guest mode available)
  - **Ephemeral:** No

- **Date of Birth**
  - ✅ Collected
  - **Why:** App functionality (Divine Timing, astrological calculations)
  - **Optional:** No
  - **Ephemeral:** No

#### Location (Optional)
- **Approximate Location**
  - ✅ Collected (optional)
  - **Why:** App functionality (prayer times)
  - **Optional:** Yes
  - **Ephemeral:** No

---

### Step 3: Data Usage

For each data type, select purposes:

#### Email Address:
- ✅ **Account management**
- ❌ Advertising or marketing
- ❌ Fraud prevention, security, and compliance
- ❌ Personalization
- ❌ Analytics

#### Name & DOB:
- ✅ **App functionality**
- ✅ **Personalization**
- ❌ Advertising or marketing
- ❌ Fraud prevention, security, and compliance
- ❌ Analytics

#### Location:
- ✅ **App functionality** (prayer times)
- ❌ Advertising or marketing
- ❌ Fraud prevention, security, and compliance
- ❌ Personalization
- ❌ Analytics

#### Advertising ID:
- ❌ App functionality
- ✅ **Advertising or marketing** (Google AdMob)
- ❌ Fraud prevention, security, and compliance
- ❌ Personalization
- ❌ Analytics

---

### Step 4: Data Sharing

**Do you share user data with third parties?**  
✅ **YES**

**Third-party data sharing:**

1. **Authentication Service** (Supabase)
   - Email addresses
   - **Purpose:** Account management
   - **Account mode only**

2. **Advertising Network** (Google AdMob)
   - Advertising ID, device info, ad interactions
   - **Purpose:** Advertising or marketing
   - **Both modes**

3. **AI Service Provider** (Groq)
   - Names, dates, user questions
   - **Purpose:** App functionality (Islamic guidance)
   - **Both modes**

---

### Step 5: Privacy Policy

**Privacy Policy URL:** `https://zaibaitech.github.io/asrar-mobile/privacy.html`

---

## 📝 Key Messaging for Both Stores

Use this consistent language:

### Guest Mode vs Account Mode
```
Asrar offers two privacy modes:

🔒 Guest Mode (Default):
- All data stored locally on your device
- No cloud sync, no email required
- Maximum privacy

☁️ Account Mode (Optional):
- Cloud backup via Supabase
- Sync across devices
- Requires email for authentication
```

### AI Processing Transparency
```
AI-Powered Islamic Guidance:
- Your questions and profile data are sent to Groq AI
- Used only to generate personalized Islamic guidance
- No data retention after processing
- Not used for advertising or analytics
```

### Data Minimization
```
We collect only what's necessary:
- Arabic name → For Ilm al-Huruf calculations
- Date of birth → For Divine Timing and astrological insights
- Location (optional) → For accurate prayer times
- Email (account mode) → For authentication only
```

### User Control
```
Your data, your control:
✅ Export your data (JSON format)
✅ Delete your account (in-app)
✅ Switch between guest/account modes
✅ Clear local data anytime
```

---

## 🎯 Category Mappings (Apple to Google)

| Apple Category | Google Category | Asrar Data |
|---------------|----------------|-----------|
| Contact Info → Email | Personal Info → Email | Account mode only |
| User Content | Personal Info → Name | Arabic name |
| User Content | Personal Info → Date of Birth | For calculations |
| Location → Coarse | Location → Approximate | Prayer times (optional) |
| Identifiers → User ID | N/A | Supabase user ID (internal) |

---

## ⚠️ Important Notes

### For Apple Reviewers:
- **Guest mode is default** - No email required to use the app
- **Account mode is optional** - For users who want cloud backup
- **Location is optional** - Only needed for prayer time accuracy
- **AI processing disclosed** - Clear in privacy policy and UI

### For Google Reviewers:
- **Data safety form must match privacy policy exactly**
- **"Account management" is accurate** for email usage
- **"App functionality" is accurate** for names/DOB (calculations)
- **No advertising/analytics SDKs** - We don't use them

### Testing Tips:
1. **Test Guest Mode:** Show that no email is required
2. **Test Account Mode:** Demonstrate cloud sync benefits
3. **Test Deletion:** Show in-app account deletion works
4. **Test Export:** Download JSON file of user data

---

## ✅ Pre-Submission Checklist

Before clicking "Submit for Review":

### Documentation:
- [ ] Privacy Policy live at GitHub Pages
- [ ] Privacy Policy mentions AdMob/advertising
- [ ] Terms of Service live at GitHub Pages
- [ ] Both URLs accessible without login
- [ ] Both URLs match in-app links

### App Store Connect:
- [ ] All data types marked correctly
- [ ] Advertising Identifier declared
- [ ] Third-party sharing disclosed (Supabase, AdMob, Groq)
- [ ] Privacy Policy URL added
- [ ] Screenshots show legal links in Profile
- [ ] App description mentions privacy modes

### Google Play Console:
- [ ] **App Content → Ads: YES** ⚠️ CRITICAL
- [ ] Data Safety form completed
- [ ] Advertising ID included in data types
- [ ] All purposes selected correctly
- [ ] Privacy Policy URL added
- [ ] Data deletion available (confirmed)
- [ ] Encryption in transit (confirmed)

### In-App Verification:
- [ ] Legal links open correctly in browser
- [ ] Delete Account button visible (account mode)
- [ ] Export Data button works
- [ ] Password strength meter shows on signup
- [ ] Guest mode works without email

---

## 🚀 Next Steps

1. **Fill out Apple App Privacy** (10-15 minutes)
2. **Fill out Google Data Safety** (10-15 minutes)
3. **Take screenshots** of legal links in Profile screen
4. **Write app descriptions** mentioning privacy features
5. **Submit for review** 🎉

**Remember:** These forms are NOT code changes. This is purely console work. Your app already implements everything correctly!

---

**Questions?**
- Apple Guidelines: https://developer.apple.com/app-store/app-privacy-details/
- Google Guidelines: https://support.google.com/googleplay/android-developer/answer/10787469

**Status:** ✅ App is technically ready. Just need console configuration!
