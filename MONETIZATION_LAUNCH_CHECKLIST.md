# 🚀 Monetization Launch Checklist

**Quick reference for implementing monetization before launch**

---

## 📋 PRE-IMPLEMENTATION DECISIONS

### ✅ Step 1: Define Strategy (1-2 hours)
- [ ] Choose monetization model:
  - [ ] Premium-only (subscriptions, no ads)
  - [ ] Freemium + Ads
  - [ ] Hybrid (recommended: freemium with optional ads later)
  
- [ ] Set subscription pricing:
  - [ ] Monthly: $______
  - [ ] Yearly: $______ (discount: ___%)
  
- [ ] Define FREE tier features (list below):
  ```
  FREE:
  - 
  - 
  - 
  ```
  
- [ ] Define PREMIUM tier features (list below):
  ```
  PREMIUM:
  - 
  - 
  - 
  ```

---

## 🛠 PHASE 1: RevenueCat Setup (Day 1-2)

### Account Setup
- [ ] Create RevenueCat account (https://app.revenuecat.com/)
- [ ] Create new project in RevenueCat
- [ ] Get RevenueCat API keys (public iOS & Android keys)
- [ ] Save keys to `.env` file

### App Store Connect (iOS)
- [ ] Create app in App Store Connect (if not already)
- [ ] Add in-app purchase products:
  - [ ] Monthly subscription (asrariya_premium_monthly)
  - [ ] Yearly subscription (asrariya_premium_yearly)
- [ ] Configure subscription group
- [ ] Set pricing for each product
- [ ] Submit products for review

### Google Play Console (Android)
- [ ] Create app in Play Console (if not already)
- [ ] Add in-app products:
  - [ ] Monthly subscription (asrariya_premium_monthly)
  - [ ] Yearly subscription (asrariya_premium_yearly)
- [ ] Set pricing for each product
- [ ] Activate products

### RevenueCat Configuration
- [ ] Connect App Store Connect account to RevenueCat
- [ ] Connect Google Play account to RevenueCat
- [ ] Create Offerings in RevenueCat dashboard
- [ ] Map products to offerings
- [ ] Test API connection

---

## 💻 PHASE 2: Code Implementation (Day 3-4)

### Package Installation
```bash
npm install react-native-purchases
npx expo prebuild
```

### File Creation Checklist
- [ ] Create `services/RevenueCatService.ts`
  - [ ] Initialize Purchases SDK
  - [ ] Configure with API keys
  - [ ] Implement purchasePackage()
  - [ ] Implement restorePurchases()
  - [ ] Implement getCustomerInfo()
  - [ ] Implement getOfferings()

- [ ] Create `contexts/SubscriptionContext.tsx`
  - [ ] SubscriptionProvider component
  - [ ] isPremium state
  - [ ] products state
  - [ ] purchasePackage function
  - [ ] restorePurchases function
  - [ ] checkSubscription function

- [ ] Create `app/paywall.tsx`
  - [ ] Beautiful UI showcasing premium features
  - [ ] Subscription options (monthly/yearly)
  - [ ] Purchase buttons
  - [ ] Restore purchases button
  - [ ] Loading states
  - [ ] Error handling

- [ ] Create `components/PaywallModal.tsx`
  - [ ] Reusable modal version of paywall
  - [ ] Can be triggered from any screen

- [ ] Create `app/subscription-settings.tsx`
  - [ ] Display current subscription status
  - [ ] Manage subscription link
  - [ ] Billing information

### App Configuration
- [ ] Update `app.json`:
  ```json
  {
    "expo": {
      "plugins": [
        [
          "react-native-purchases",
          {
            "revenuecat_api_key_ios": "YOUR_IOS_KEY",
            "revenuecat_api_key_android": "YOUR_ANDROID_KEY"
          }
        ]
      ]
    }
  }
  ```

- [ ] Update `.env`:
  ```
  EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_...
  EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_...
  ```

### Feature Gating Implementation
- [ ] Update `app/(tabs)/planet-detail.tsx`
  - [ ] Check `isPremium` from context
  - [ ] Show paywall for premium features
  - [ ] Update existing premium appetite cards

- [ ] Update `app/(tabs)/divine-timing.tsx`
  - [ ] Lock AI guidance behind paywall
  - [ ] Show upgrade prompt for free users

- [ ] Update `services/QuranResonanceService.ts`
  - [ ] Add subscription tier check
  - [ ] Lock advanced insights

- [ ] Update `app/profile.tsx`
  - [ ] Display subscription status
  - [ ] Add "Manage Subscription" button
  - [ ] Show upgrade button for free users

- [ ] Wrap `app/_layout.tsx` with SubscriptionProvider

---

## 🧪 PHASE 3: Testing (Day 5-6)

### Sandbox Testing (iOS)
- [ ] Build development version
- [ ] Sign in with sandbox test account
- [ ] Test monthly subscription purchase
- [ ] Test yearly subscription purchase
- [ ] Verify premium features unlock
- [ ] Test restore purchases
- [ ] Test subscription expiry
- [ ] Test cancellation flow

### Sandbox Testing (Android)
- [ ] Build development version
- [ ] Add test account to Play Console
- [ ] Test monthly subscription purchase
- [ ] Test yearly subscription purchase
- [ ] Verify premium features unlock
- [ ] Test restore purchases
- [ ] Test subscription expiry

### Edge Cases
- [ ] Test with no internet connection
- [ ] Test payment decline
- [ ] Test already subscribed user
- [ ] Test free user accessing premium feature
- [ ] Test subscription cancellation
- [ ] Test re-subscription
- [ ] Test cross-platform (subscribe on iOS, restore on Android)

### User Flows
- [ ] Free user → see locked feature → tap upgrade → purchase → unlock
- [ ] Free user → profile → upgrade → purchase
- [ ] Premium user → verify all features accessible
- [ ] Premium user → cancel → verify still works until expiry
- [ ] Expired user → access premium feature → paywall shown

---

## 📱 PHASE 4: UI/UX Polish (Day 7)

### Paywall Design
- [ ] Beautiful gradient background
- [ ] Clear feature comparison (free vs premium)
- [ ] Compelling copy highlighting value
- [ ] Monthly/yearly toggle with "Save X%" badge
- [ ] Clear pricing display
- [ ] Restore purchases link (bottom)
- [ ] Terms & privacy policy links

### Feature Lock States
- [ ] Premium badge on locked features
- [ ] Blur or lock icon overlay
- [ ] "Upgrade to Premium" CTA button
- [ ] Smooth animations
- [ ] Consistent styling across app

### Success States
- [ ] Purchase success animation
- [ ] Welcome message for new premium users
- [ ] Confetti or celebration effect
- [ ] Redirect to unlocked feature

### Error Handling
- [ ] Payment failed alert
- [ ] Network error message
- [ ] Restore failed message
- [ ] Clear error messages (not technical)

---

## 🔍 PHASE 5: Production Testing (Day 8-9)

### iOS Production Testing
- [ ] Create TestFlight build
- [ ] Add test users
- [ ] Test real purchase (refund after)
- [ ] Verify receipts in RevenueCat
- [ ] Check analytics tracking
- [ ] Test on multiple iOS versions

### Android Production Testing
- [ ] Create internal testing build
- [ ] Add test users
- [ ] Test real purchase (refund after)
- [ ] Verify receipts in RevenueCat
- [ ] Check analytics tracking
- [ ] Test on multiple Android versions

### Analytics Verification
- [ ] Verify purchases appear in RevenueCat
- [ ] Check conversion funnel
- [ ] Verify paywall views tracked
- [ ] Check subscription status sync

---

## 📊 PHASE 6: Monitoring Setup (Day 10)

### RevenueCat Dashboard
- [ ] Set up Charts to monitor revenue
- [ ] Configure customer lists
- [ ] Set up webhooks (optional)
- [ ] Enable email notifications for purchases

### Analytics
- [ ] Track paywall views
- [ ] Track purchase attempts
- [ ] Track successful purchases
- [ ] Track restore attempts
- [ ] Track feature usage (free vs premium)

### Alerts
- [ ] Set up revenue alerts
- [ ] Set up churn alerts
- [ ] Set up error rate alerts

---

## 🚀 LAUNCH CHECKLIST

### Pre-Launch (Final 24 Hours)
- [ ] All sandbox tests passing
- [ ] Production tests successful
- [ ] Premium features verified working
- [ ] Free tier limitations verified
- [ ] Paywall UI/UX polished
- [ ] Error handling tested
- [ ] RevenueCat dashboard configured
- [ ] Analytics tracking verified

### App Store Submission
- [ ] App description mentions premium features
- [ ] Screenshots show premium value
- [ ] Privacy policy updated (mentions subscriptions)
- [ ] In-app purchases configured
- [ ] Pricing set correctly
- [ ] Subscription terms clear

### Launch Day
- [ ] Monitor RevenueCat dashboard
- [ ] Watch for payment errors
- [ ] Monitor conversion rate
- [ ] Check user feedback
- [ ] Be ready to hotfix issues

---

## 📈 POST-LAUNCH (Week 1)

### Metrics to Track
- [ ] Total downloads
- [ ] Paywall view rate
- [ ] Conversion rate (views → purchases)
- [ ] Monthly recurring revenue (MRR)
- [ ] Average revenue per user (ARPU)
- [ ] Churn rate

### Optimization
- [ ] A/B test paywall copy
- [ ] Test different pricing
- [ ] Optimize free tier limits
- [ ] Analyze user drop-off points

---

## 🎯 OPTIONAL: Google AdMob (Future v1.1)

### If Adding Ads for Free Users
- [ ] Create AdMob account
- [ ] Create ad units (banner, interstitial)
- [ ] Install `react-native-google-mobile-ads`
- [ ] Configure `app.json` with ad IDs
- [ ] Create `BannerAd` component
- [ ] Add ads to free user screens
- [ ] Hide ads for premium users
- [ ] Test ad display
- [ ] Monitor ad revenue

---

## ⚠️ CRITICAL NOTES

### Don't Launch Without:
- ✅ Working subscription purchase flow
- ✅ Premium features properly gated
- ✅ Restore purchases working
- ✅ Clear free vs premium distinction
- ✅ Tested on both iOS & Android

### Can Launch Without (add later):
- ❌ Ads (can add in v1.1)
- ❌ Multiple subscription tiers (add if needed)
- ❌ Advanced analytics
- ❌ A/B testing

### Remember:
- Sandbox testing ≠ production (always test production!)
- RevenueCat caches subscription status (use `.invalidateCustomerInfoCache()` when testing)
- iOS requires App Store review for first in-app purchase
- Android activation can take hours
- Always offer restore purchases (required by Apple)

---

## 📞 RESOURCES

### Documentation
- RevenueCat Docs: https://docs.revenuecat.com/docs/reactnative
- React Native Purchases: https://github.com/RevenueCat/react-native-purchases
- RevenueCat Sample: https://github.com/RevenueCat/purchases-ios/tree/main/Examples

### Support
- RevenueCat Support: https://community.revenuecat.com/
- RevenueCat Slack: https://www.revenuecat.com/slack

### Testing
- iOS Sandbox Testing: https://developer.apple.com/app-store/sandboxing/
- Android Test Purchases: https://developer.android.com/google/play/billing/test

---

**Estimated Total Time**: 40-60 hours for full implementation
**Minimum Viable**: 20-30 hours (subscriptions only, basic UI)

**Status**: ⏳ NOT STARTED  
**Target**: Launch with monetization in 7-10 days

---

*Checklist created: January 17, 2026*
