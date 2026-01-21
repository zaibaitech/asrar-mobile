# 🛒 Phase 3: RevenueCat Account Setup Guide

**App Name**: Asrariya  
**Bundle ID**: `com.zaibaitech.asrariya`  
**Product ID Prefix**: `asrariya_premium_`

---

## 📋 Quick Reference

| Item | Value |
|------|-------|
| Bundle ID (iOS & Android) | `com.zaibaitech.asrariya` |
| Monthly Product ID | `asrariya_premium_monthly` |
| Yearly Product ID | `asrariya_premium_yearly` |
| Entitlement Name | `premium` |
| Offering Name | `default` |
| Monthly Price | $3.99/month |
| Yearly Price | $29.99/year |

---

## Step 1: Create RevenueCat Account

1. Go to [app.revenuecat.com](https://app.revenuecat.com)
2. Click **Sign Up** (use Google or email)
3. Create a new **Project**:
   - Name: `Asrariya`
   - Click **Create Project**

---

## Step 2: iOS Setup (App Store Connect)

### 2.1 Create App in App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to **My Apps** → **+** → **New App**
3. Fill in:
   - Platform: iOS
   - Name: `Asrariya`
   - Bundle ID: `com.zaibaitech.asrariya`
   - SKU: `asrariya`

### 2.2 Create Subscription Group
1. In your app, go to **Subscriptions** tab
2. Click **+** next to "Subscription Groups"
3. Name: `Asrariya Premium`
4. Click **Create**

### 2.3 Create Products
Inside the subscription group, create these products:

#### Monthly Subscription
| Field | Value |
|-------|-------|
| Reference Name | Asrariya Premium Monthly |
| Product ID | `asrariya_premium_monthly` |
| Subscription Duration | 1 Month |
| Price | $3.99 (Tier 4) |

#### Yearly Subscription
| Field | Value |
|-------|-------|
| Reference Name | Asrariya Premium Yearly |
| Product ID | `asrariya_premium_yearly` |
| Subscription Duration | 1 Year |
| Price | $29.99 (Tier 30) |

### 2.4 Add Localized Names
For each product, add display names in:
- **English**: "Asrariya Premium Monthly" / "Asrariya Premium Yearly"
- **French**: "Asrariya Premium Mensuel" / "Asrariya Premium Annuel"
- **Arabic**: "أسرارية بريميوم شهري" / "أسرارية بريميوم سنوي"

### 2.5 Get App-Specific Shared Secret
1. Go to **App Store Connect** → **Users and Access** → **Integrations**
2. Or in your app: **App Information** → **App-Specific Shared Secret**
3. Click **Generate** if not created
4. **Copy this secret** - you'll need it for RevenueCat

---

## Step 3: Android Setup (Google Play Console)

### 3.1 Create App in Google Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Click **Create app**
3. Fill in:
   - App name: `Asrariya`
   - Default language: English
   - App or game: App
   - Free or paid: Free

### 3.2 Create Subscriptions
1. Navigate to **Monetize** → **Products** → **Subscriptions**
2. Click **Create subscription**

#### Monthly Subscription
| Field | Value |
|-------|-------|
| Product ID | `asrariya_premium_monthly` |
| Name | Asrariya Premium Monthly |
| Description | Full access to all premium features |

Then add a **Base Plan**:
- Billing period: 1 Month
- Price: $3.99

#### Yearly Subscription
| Field | Value |
|-------|-------|
| Product ID | `asrariya_premium_yearly` |
| Name | Asrariya Premium Yearly |
| Description | Full access to all premium features - Best Value! |

Then add a **Base Plan**:
- Billing period: 1 Year
- Price: $29.99

### 3.3 Create Service Account (For RevenueCat)
1. Go to **Setup** → **API access**
2. Under "Service accounts", click **Create new service account**
3. Follow the link to Google Cloud Console
4. Create service account:
   - Name: `RevenueCat`
   - Role: None needed
5. Create a **JSON key** and download it
6. Back in Play Console, grant access:
   - Click **Grant access** next to the service account
   - Permissions: **Financial data, orders, and cancellation survey responses**
   - App permissions: Your app → **View financial data** + **Manage orders**

---

## Step 4: Configure RevenueCat

### 4.1 Add iOS App
1. In RevenueCat dashboard, click **+ Add App**
2. Select **Apple App Store**
3. Fill in:
   - App name: `Asrariya iOS`
   - Bundle ID: `com.zaibaitech.asrariya`
   - App Store Connect App-Specific Shared Secret: (paste from Step 2.5)
4. Click **Save**

### 4.2 Add Android App
1. Click **+ Add App** again
2. Select **Google Play Store**
3. Fill in:
   - App name: `Asrariya Android`
   - Package name: `com.zaibaitech.asrariya`
   - Service Account credentials: Upload JSON from Step 3.3
4. Click **Save**

### 4.3 Create Entitlement
1. Go to **Project Settings** → **Entitlements**
2. Click **+ New**
3. Name: `premium`
4. Click **Add**

### 4.4 Create Products in RevenueCat
1. Go to **Products** tab
2. Click **+ New**

#### iOS Products
| Field | Value |
|-------|-------|
| Identifier | `asrariya_premium_monthly` |
| App | Asrariya iOS |
| Store | App Store |

Repeat for `asrariya_premium_yearly`

#### Android Products
| Field | Value |
|-------|-------|
| Identifier | `asrariya_premium_monthly` |
| App | Asrariya Android |
| Store | Play Store |

Repeat for `asrariya_premium_yearly`

### 4.5 Attach Products to Entitlement
1. Go back to **Entitlements** → **premium**
2. Click **Attach**
3. Select all 4 products (iOS monthly, iOS yearly, Android monthly, Android yearly)

### 4.6 Create Offering
1. Go to **Offerings** tab
2. You should see a **default** offering (or create one)
3. Click on it → **+ Add Package**

#### Add Monthly Package
| Field | Value |
|-------|-------|
| Identifier | `$rc_monthly` |
| Products | Select both iOS and Android monthly products |

#### Add Yearly Package
| Field | Value |
|-------|-------|
| Identifier | `$rc_annual` |
| Products | Select both iOS and Android yearly products |

---

## Step 5: Get API Keys

### 5.1 Find Your API Keys
1. In RevenueCat, go to your **Asrariya iOS** app
2. Find **Public app-specific API keys**
3. Copy the key (starts with `appl_`)

4. Go to your **Asrariya Android** app
5. Copy the key (starts with `goog_`)

### 5.2 Update Your .env File
```env
# RevenueCat API Keys
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=appl_XXXXXXXXXXXXXXXX
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=goog_XXXXXXXXXXXXXXXX
```

---

## Step 6: Test Setup

### 6.1 iOS Sandbox Testing
1. In App Store Connect, go to **Users and Access** → **Sandbox** → **Testers**
2. Create a sandbox tester account
3. On your test device:
   - Sign out of real App Store account
   - Sign in with sandbox account when prompted during purchase

### 6.2 Android Testing
1. In Google Play Console, go to **Setup** → **License testing**
2. Add your test Gmail addresses
3. Set license response to: **RESPOND_NORMALLY**

---

## ✅ Checklist Summary

### RevenueCat Account
- [ ] Account created at app.revenuecat.com
- [ ] Project "Asrariya" created

### iOS (App Store Connect)
- [ ] App created with bundle ID `com.zaibaitech.asrariya`
- [ ] Subscription group "Asrariya Premium" created
- [ ] Product `asrariya_premium_monthly` created ($3.99)
- [ ] Product `asrariya_premium_yearly` created ($29.99)
- [ ] Localized names added (EN/FR/AR)
- [ ] App-Specific Shared Secret generated

### Android (Google Play Console)
- [ ] App created with package `com.zaibaitech.asrariya`
- [ ] Subscription `asrariya_premium_monthly` created ($3.99)
- [ ] Subscription `asrariya_premium_yearly` created ($29.99)
- [ ] Service account created and JSON downloaded

### RevenueCat Configuration
- [ ] iOS app added with shared secret
- [ ] Android app added with service credentials
- [ ] Entitlement "premium" created
- [ ] 4 products created (iOS/Android × Monthly/Yearly)
- [ ] Products attached to "premium" entitlement
- [ ] Offering "default" configured with `$rc_monthly` and `$rc_annual`
- [ ] API keys copied

### Environment
- [ ] `.env` updated with `EXPO_PUBLIC_REVENUECAT_API_KEY_IOS`
- [ ] `.env` updated with `EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID`

### Testing
- [ ] iOS sandbox tester created
- [ ] Android license testers added

---

## 🔗 Useful Links

| Resource | URL |
|----------|-----|
| RevenueCat Dashboard | https://app.revenuecat.com |
| App Store Connect | https://appstoreconnect.apple.com |
| Google Play Console | https://play.google.com/console |
| RevenueCat Docs | https://docs.revenuecat.com |
| iOS Subscription Setup | https://docs.revenuecat.com/docs/ios-products |
| Android Subscription Setup | https://docs.revenuecat.com/docs/android-products |

---

## ⚠️ Common Issues

### "Product not found" error
- Ensure product IDs match exactly (case-sensitive)
- Wait 15-30 minutes after creating products in App Store Connect
- Check products are in "Ready to Submit" or "Approved" status

### RevenueCat not fetching products
- Verify Shared Secret is correct for iOS
- Verify Service Account JSON is properly uploaded for Android
- Check offerings are marked as "Current"

### Sandbox purchases not working
- Must be signed out of real Apple ID
- Sandbox account must be created in App Store Connect
- For Android, email must be in license testing list
