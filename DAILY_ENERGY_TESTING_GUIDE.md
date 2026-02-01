# Daily Energy Screen Redesign - Testing Guide

## Overview
This guide provides step-by-step instructions for testing the redesigned Daily Energy screen with its new narrative-driven synthesis system.

## Prerequisites
- Expo development environment set up
- Device or simulator with the app installed
- Network connection for API calls
- Test user accounts with different profile states

## Quick Test Checklist

### ✅ Core Functionality
- [ ] Screen loads without crashes
- [ ] Synthesis generates successfully
- [ ] All 4 new components render correctly
- [ ] Loading state appears for synthesis >100ms
- [ ] Error handling works when synthesis fails
- [ ] Fallback state works for users without profiles

### ✅ Multi-Language Support
- [ ] English (EN) - All text displays correctly
- [ ] French (FR) - All translations appear
- [ ] Arabic (AR) - RTL layout works, text displays

### ✅ UI/UX
- [ ] Touch targets are appropriately sized
- [ ] ScrollView scrolls smoothly
- [ ] Cards have proper spacing
- [ ] Colors follow design system
- [ ] Typography is readable

## Detailed Testing Procedures

### 1. Screen Load Test

**Goal:** Verify screen loads and displays synthesis

**Steps:**
1. Launch app and navigate to Daily Guidance
2. Tap on "Daily Energy Details" or equivalent navigation
3. Observe loading behavior

**Expected Results:**
- ✨ Loading card appears (if synthesis takes >100ms)
- Loading message: "✨ Generating your personalized guidance..."
- Loading completes within 1-2 seconds
- Screen transitions to success state

**Pass Criteria:**
- No crashes or freezes
- Loading indicator shows (if applicable)
- Synthesis displays after loading

---

### 2. Synthesis Success State Test

**Goal:** Verify all components render with real data

**Steps:**
1. Ensure user has complete profile (birth chart + name data)
2. Navigate to Daily Energy Details screen
3. Wait for synthesis to load

**Expected Results:**

**Section 1: Main Analysis Card**
- Card with purple border appears
- Title: "Today's Celestial Alignment"

**TodaysRulerSection:**
- Day name (e.g., "Monday • Moon Day")
- Planet symbol (e.g., 🌙)
- Element (e.g., "Water")
- Transit info (if available): sign, power bar, dignity
- Description text

**UserPlanetSection:**
- User's planet symbol and name
- Element display
- Source badge (Birth Chart / Name Analysis / Default)

**TodaysAlignmentSection:**
- 3 alignment factors displayed:
  1. Planetary Friendship (color-coded badge)
  2. Elemental Harmony (color-coded badge)
  3. Daily Strength (color-coded badge)

**WhatThisMeansCard:**
- Overall quality (Excellent/Good/Moderate/Challenging)
- Personalized synthesis paragraph
- "Activities to embrace" list with 3-5 items
- "Activities to avoid" list with 3-5 items

**Pass Criteria:**
- All sections render completely
- No missing text or broken layouts
- Colors match quality level
- All data is contextually appropriate

---

### 3. Loading State Test

**Goal:** Verify loading indicator appears during synthesis

**Steps:**
1. Clear app cache/storage (to force fresh calculation)
2. Navigate to Daily Energy Details
3. Observe first 100-200ms of screen load

**Expected Results:**
- Loading card with purple tint appears
- Message: "✨ Generating your personalized guidance..."
- No flickering or layout shifts
- Smooth transition to success state

**Pass Criteria:**
- Loading state is visible
- No white flash or blank screen
- Professional loading experience

**Note:** Loading may be very fast (<100ms) on powerful devices, making it hard to see.

---

### 4. Error State Test

**Goal:** Verify graceful error handling

**Method 1: Network Simulation**
1. Enable airplane mode or disconnect network
2. Navigate to Daily Energy Details
3. Observe error state

**Method 2: Code Injection (Development)**
1. Temporarily modify `DailySynthesisService.generateDailySynthesis()` to throw error
2. Navigate to Daily Energy Details

**Expected Results:**
- Error card with red tint appears
- Error icon: ⚠️
- Title: "Unable to Generate Guidance"
- Message: "We couldn't generate today's personalized guidance. Please refresh the screen to try again."
- "Refresh" button present

**Refresh Button Test:**
1. Tap "Refresh" button
2. Observe behavior

**Expected After Refresh:**
- Loading state appears
- If network restored: synthesis loads successfully
- If network still down: error persists

**Pass Criteria:**
- Error displays clearly
- User understands what went wrong
- Refresh button functions correctly
- No crashes or infinite loops

---

### 5. Fallback State Test (No User Profile)

**Goal:** Verify generic guidance for users without profiles

**Steps:**
1. Create new user account OR clear user profile data
2. Navigate to Daily Energy Details
3. Observe fallback state

**Expected Results:**
- Generic card appears (standard card styling)
- Title: "✨ Today's Energy"
- Generic synthesis text (based on day ruler only)
- Note message: "💡 Complete your profile to see personalized guidance based on your planetary nature."

**Pass Criteria:**
- Generic guidance is meaningful
- Note encourages profile completion
- No errors about missing data
- User still gets value from the feature

---

### 6. Multi-Language Test

**Goal:** Verify all translations work correctly

#### English (EN) Test
**Steps:**
1. Set app language to English
2. Navigate to Daily Energy Details
3. Verify all text is in English

**Check These Keys:**
- Day ruler names (e.g., "Monday • Moon Day")
- Section titles
- Button labels ("Refresh")
- Synthesis text
- Activity lists
- Relationship descriptions

---

#### French (FR) Test
**Steps:**
1. Set app language to French
2. Navigate to Daily Energy Details
3. Verify all text is in French

**Check These Keys:**
- Day ruler names (e.g., "Lundi • Jour de la Lune")
- Section titles translated
- Button labels ("Actualiser")
- Synthesis text in French
- Activity lists in French
- Relationship descriptions translated

**Watch For:**
- Any English text appearing (indicates missing translation)
- Broken characters or encoding issues
- Layout issues with longer French text

---

#### Arabic (AR) Test
**Steps:**
1. Set app language to Arabic
2. Navigate to Daily Energy Details
3. Verify all text is in Arabic

**Check These Keys:**
- Day ruler names with Arabic names (e.g., "الاثنين • يوم القمر")
- All UI text in Arabic script
- RTL (Right-to-Left) layout working
- Button labels in Arabic

**Watch For:**
- LTR text appearing (indicates missing RTL support)
- Broken Arabic characters
- Numbers displaying correctly (1, 2, 3 vs ١, ٢, ٣)
- Alignment issues with RTL layout

---

### 7. All 7 Days Test

**Goal:** Verify synthesis works for all days of the week

**Steps:**
1. Test each day by changing device date OR waiting for each day
2. For each day, verify:
   - Correct day ruler appears
   - Correct planet symbol
   - Correct element
   - Different synthesis text

**Days to Test:**
- ☀️ Sunday (Sun / Fire)
- 🌙 Monday (Moon / Water)
- ♂️ Tuesday (Mars / Fire)
- ☿ Wednesday (Mercury / Air)
- ♃ Thursday (Jupiter / Air)
- ♀ Friday (Venus / Water)
- ♄ Saturday (Saturn / Earth)

**Pass Criteria:**
- Each day shows unique ruler
- Synthesis is contextually appropriate
- No crashes on any day

---

### 8. Edge Cases Test

#### Test Case: User with Only Birth Chart
**Setup:** User has birth chart but no name analysis
**Expected:** Planet from birth chart, source badge shows "Birth Chart"

#### Test Case: User with Only Name Analysis
**Setup:** User has name analysis but no birth chart
**Expected:** Planet from name, source badge shows "Name Analysis"

#### Test Case: User with Both Sources
**Setup:** User has both birth chart and name analysis
**Expected:** Birth chart takes priority, source badge shows "Birth Chart"

#### Test Case: Fast Network (Synthesis <100ms)
**Expected:** Loading state may not appear (too fast), direct to success

#### Test Case: Slow Network (Synthesis >1s)
**Expected:** Loading state visible for entire duration

#### Test Case: Partial Profile Data
**Setup:** User has some fields missing
**Expected:** Fallback logic fills in missing data

---

### 9. Performance Test

**Goal:** Verify screen performs well

**Metrics to Check:**
- Time to first render: <500ms
- Synthesis generation: <2 seconds
- ScrollView framerate: 60fps
- Memory usage: Stable (no leaks)

**Steps:**
1. Navigate to screen 10 times in a row
2. Monitor memory usage
3. Check for performance degradation

**Pass Criteria:**
- No slowdowns after repeated visits
- Memory returns to baseline after leaving screen
- Smooth scrolling throughout

---

### 10. Device-Specific Tests

#### iOS Test
**Devices to Test:**
- iPhone SE (small screen)
- iPhone 14 Pro (standard)
- iPhone 14 Pro Max (large screen)

**Check:**
- Safe area handling
- Notch compatibility
- Haptic feedback (if any)
- Font rendering

#### Android Test
**Devices to Test:**
- Small phone (5" screen)
- Standard phone (6" screen)
- Tablet (10" screen)

**Check:**
- Status bar handling
- Navigation bar compatibility
- Font rendering
- Back button behavior

---

## Known Issues to Watch For

### Pre-existing TypeScript Errors
These errors exist in the codebase but don't affect runtime:
- `DarkTheme.accent` property missing
- Various type definition mismatches
- These are being tracked separately

### Potential Issues
1. **Synthesis very fast**: Loading state may not appear (<100ms)
2. **Missing transit data**: Some days may not have full transit info
3. **Profile data format**: Different profile structures may cause fallbacks

---

## Reporting Bugs

When filing a bug report, include:

**Required Info:**
1. Device/Simulator (e.g., "iPhone 14 Pro iOS 17.2")
2. App language setting (EN/FR/AR)
3. User profile state (has birth chart? has name?)
4. Current day of week
5. Steps to reproduce
6. Expected behavior
7. Actual behavior

**Screenshots:**
- Include screenshots of the bug
- Mark areas of concern with annotations

**Logs:**
- Check console for error messages
- Include relevant stack traces

---

## Success Criteria Summary

**✅ Feature is production-ready when:**
- All 4 UI states work correctly (loading, error, success, fallback)
- All 3 languages display properly (EN, FR, AR)
- All 7 days of the week work
- No crashes or critical errors
- Performance is acceptable (synthesis <2s)
- Error handling is graceful
- User feedback is clear and helpful

---

## Next Steps After Testing

1. **Fix any bugs found** during testing
2. **Update documentation** with any new findings
3. **User acceptance testing** with real users
4. **Analytics implementation** to track usage patterns
5. **A/B testing** (if desired) to compare with old design
6. **Submit for review** (App Store/Play Store if applicable)

---

## Contact

For questions about testing or to report issues:
- Check [DAILY_ENERGY_REDESIGN_IMPLEMENTATION_COMPLETE.md](DAILY_ENERGY_REDESIGN_IMPLEMENTATION_COMPLETE.md) for implementation details
- See [DAILY_ENERGY_REDESIGN_QUICK_REFERENCE.md](DAILY_ENERGY_REDESIGN_QUICK_REFERENCE.md) for code reference

---

**Last Updated:** December 2024  
**Version:** 1.0 - Initial Release
