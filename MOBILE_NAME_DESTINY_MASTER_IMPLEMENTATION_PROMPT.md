📱 Multi-Phase Implementation Prompt - Name Destiny Mobile App
Expo Go 54 | 6-Week Execution Plan

🎯 MASTER IMPLEMENTATION PROMPT
Use this multi-phase prompt to systematically build your Name Destiny mobile app. Follow each phase sequentially, checking off tasks as you complete them.

PHASE 1: Foundation & Setup (Week 1)
Goal: Project structure ready + core calculation engine ported
Expected Time: 15 hours
Success: Calculator works in tests, navigation structure ready

1.1 Project Initialization (3 hours)
✅ Checklist:

 Project created without errors
 npm start launches successfully
 Can scan QR code with Expo Go
 All dependencies installed
1.2 Port Calculation Engine (4 hours)
Reference: MOBILE_NAME_DESTINY_QUICK_CODE_SNIPPETS.md → Phase 2

Create src/features/name-destiny/constants/abjadMaps.ts:

Copy ABJAD_MAGHRIBI data (exactly as in QUICK_CODE_SNIPPETS.md)
Copy ABJAD_MASHRIQI data
Export both as named exports
Create src/features/name-destiny/constants/elements.ts:

Copy ELEMENTS constant (all 4 elements with translations)
Copy BURUJ constant (all 12 zodiac signs)
Ensure all ar/en/fr translations present
Create src/features/name-destiny/services/nameDestinyCalculator.ts:

Copy helper functions: digitalRoot(), modIndex()
Copy main function: buildDestiny()
Ensure no React dependencies (pure TypeScript)
Add proper type imports
✅ Checklist:

 abjadMaps.ts created and exports correct data
 elements.ts created with complete data
 Calculator functions compile without errors
 No TypeScript errors in strict mode
1.3 Create Type Definitions (2 hours)
Create index.ts:

Reference: MOBILE_NAME_DESTINY_IMPLEMENTATION_GUIDE.md → Phase 1.3

✅ Checklist:

 All interfaces defined
 TypeScript strict mode passes
 No "any" types used
1.4 Setup Contexts (2 hours)
Create AbjadContext.tsx:

Provide abjadSystem state (maghribi/mashriqi)
Export useAbjad hook
Create LanguageContext.tsx:

Provide language state (en/fr/ar)
Export useLanguage hook
✅ Checklist:

 Both contexts compile
 No circular dependencies
 Hooks export correctly
1.5 Navigation Structure (2 hours)
Create src/navigation/RootNavigator.tsx:

Bottom tab navigator with 3 screens
Stack navigator for calculation flow
Proper TypeScript typing
Reference: MOBILE_NAME_DESTINY_QUICK_CODE_SNIPPETS.md → Phase 5

Create screen stubs in src/features/name-destiny/screens/:

HomeScreen.tsx (stub)
InputScreen.tsx (stub)
ResultsScreen.tsx (stub)
HistoryScreen.tsx (stub)
SettingsScreen.tsx (stub)
Create App.tsx entry point:

Import RootNavigator
Setup providers (Context)
Handle splash screen
✅ Checklist:

 App launches without errors
 Bottom tabs visible
 Can navigate between screens
 No TypeScript errors
1.6 Testing Setup (1 hour)
Create test infrastructure:

Jest config
Test templates in __tests__/
Calculator tests
Create __tests__/calculator.test.ts:

Run tests:

✅ Checklist:

 Jest configured
 Calculator tests passing
 Can run tests from command line
PHASE 2: Core UI Components (Weeks 2-3)
Goal: Complete input and results screens
Expected Time: 20 hours
Success: Full calculation flow works end-to-end

2.1 Input Screen (5 hours)
Create src/features/name-destiny/screens/InputScreen.tsx:

Reference: MOBILE_NAME_DESTINY_QUICK_CODE_SNIPPETS.md → Phase 3.1

Requirements:

 Text input for name (Arabic support)
 Text input for mother's name (optional)
 Calculate button (disabled when empty)
 Loading state during calculation
 Error handling
 Navigation to results on success
Implementation:

✅ Verification:

 Renders without errors
 Can type in both inputs
 Calculate button works
 Navigation to results works
 Responsive on small screens (375px+)
2.2 Results Screen (8 hours)
Create reusable components in src/features/name-destiny/components/:

ResultsCard.tsx (2 hours)

Reusable card component for displaying results
Props: title, value, description, icon, color
Copy from QUICK_CODE_SNIPPETS.md
ElementChart.tsx (2 hours)

Display element with gradient background
Show element name (EN/AR)
Show quality/description
Copy from QUICK_CODE_SNIPPETS.md
BurjWidget.tsx (2 hours)

Display zodiac information
Show planet and element
Show ruling details
StatDisplay.tsx (1 hour)

Generic stat card
Number + label
Create ResultsScreen.tsx (1 hour)

Scrollable layout with all cards
Display Kabir, Saghir, Element, Burj, Hour
Mother's name section if provided
Action buttons (Share, Save, Back)
Reference: MOBILE_NAME_DESTINY_QUICK_CODE_SNIPPETS.md → Phase 3.2

✅ Verification:

 All components render
 Results display correctly
 Numbers match calculations
 Mother's name adds to total correctly
 Responsive layout on all sizes
 No TypeScript errors
2.3 Connect Input → Results (3 hours)
Requirements:

 InputScreen calculates and navigates
 ResultsScreen receives data via route params
 Back button returns to input
 Can recalculate without closing app
Test Flow:

✅ Verification:

 Complete flow works
 Results update correctly
 No navigation errors
 Back button works
 Fast calculation (< 100ms)
2.4 Styling & Responsive Design (4 hours)
Create src/theme/:

colors.ts (light/dark palettes)
spacing.ts (consistent spacing)
typography.ts (font sizes)
useTheme.ts (hook for access)
Requirements:

 All components use theme
 Responsive on: 375px, 390px, 430px, 540px, 768px
 Touch targets minimum 48px
 Text readable on small screens
 Proper padding/margins
Test on Devices:

✅ Verification:

 Looks good on all screen sizes
 No layout overflow
 Readable text
 Buttons easily tappable
PHASE 3: Advanced Features & Data (Week 3)
Goal: History, favorites, offline functionality
Expected Time: 20 hours
Success: Data persists, offline mode works

3.1 Data Persistence (6 hours)
Create src/features/name-destiny/hooks/useStorage.ts:

Reference: MOBILE_NAME_DESTINY_QUICK_CODE_SNIPPETS.md → Phase 4

Implement:

✅ Verification:

 History saves after calculation
 History persists across app restart
 Can add/remove favorites
 No errors on AsyncStorage access
 Storage < 10MB
3.2 History Screen (4 hours)
Create src/features/name-destiny/screens/HistoryScreen.tsx:

Requirements:

 Display list of past calculations
 Show: Name, Date, Element, Burj
 Tap item to view full results
 Swipe to delete
 "Clear All" button
 Empty state message
 Loading state while fetching
Implementation:

✅ Verification:

 History loads on screen open
 Can tap item to see results
 Delete works
 Clear all works
 Responsive list layout
3.3 Favorites Feature (3 hours)
Integrate into ResultsScreen:

Add "Add to Favorites" button
Show if already favorited
Remove from favorites option
Create FavoritesScreen:

Display all favorites
Quick access to favorite calculations
Remove button per favorite
✅ Verification:

 Can save from results
 Saved items persist
 Can view all favorites
 Can remove favorites
 Favorites in storage < 5MB
3.4 Offline Support (4 hours)
Create offline detection:

Implementation:

Implement in InputScreen:

✅ Verification:

 Works completely offline
 Recalculates without internet
 Shows offline indicator
 Syncs when internet returns
3.5 Settings Screen (3 hours)
Create src/features/name-destiny/screens/SettingsScreen.tsx:

Features:

 Language selector (EN/FR/AR)
 Abjad system selector (Maghribi/Mashriqi)
 Dark mode toggle
 Clear cache button
 Clear history button
 About section
 Version number
Implementation:

✅ Verification:

 Language switches all UI
 Abjad changes recalculate
 Dark mode applies everywhere
 Clear operations work
 Settings persist
PHASE 4: UI Polish & Dark Mode (Week 4)
Goal: Beautiful UI, smooth animations, dark mode
Expected Time: 18 hours
Success: App feels polished and professional

4.1 Dark Mode Implementation (5 hours)
Create src/theme/useTheme.ts:

Reference: MOBILE_NAME_DESTINY_IMPLEMENTATION_GUIDE.md → Phase 4.1

Implement:

Update all components:

 Replace hardcoded colors with theme
 Support both light/dark
 Test both modes thoroughly
 Verify contrast (WCAG AA)
Color Requirements:

✅ Verification:

 Dark mode toggle works
 All screens support both modes
 Color contrast acceptable
 No unreadable text
 Persists selection
4.2 Animations & Transitions (4 hours)
Add smooth animations:

Screen Transitions:

Fade in/out on navigation
Slide from right on push
Button Interactions:

Scale on press
Opacity feedback
Loading States:

Spinner animation
Progress indicator
List Items:

Fade in when loading
Slide animation on delete
Implementation:

✅ Verification:

 Animations smooth
 No frame drops (60fps)
 Animations don't feel slow
 Loading states clear
4.3 Polish Visual Details (4 hours)
Implement:

 Proper shadows (elevation)
 Consistent border radius (8px)
 Proper spacing (grid system)
 Icon colors match element colors
 Gradient backgrounds where appropriate
 Loading skeletons for better UX
Style Requirements:

✅ Verification:

 Visual consistency
 Professional appearance
 No rough edges
 Proper elevation/shadows
4.4 Splash Screen & Branding (3 hours)
Create splash screen:

App logo/icon
Brand color background
Smooth fade to app
Implement:

Create app icons:

1024x1024 source
Auto-generate sizes
No rounded corners (system applies)
✅ Verification:

 Splash shows on launch
 Icon displays on home screen
 Professional appearance
4.5 Responsive Polish (2 hours)
Test on all sizes:

 375px (iPhone SE)
 390px (iPhone 12/13)
 430px (iPhone 14+)
 540px (Large phone)
 768px (iPad)
Fix any layout issues:

 No text overflow
 Buttons properly sized
 Cards properly proportioned
 Spacing consistent
✅ Verification:

 Works perfectly on all sizes
 Professional on tablets
 No compromises for any device
PHASE 5: Localization & Testing (Week 5)
Goal: Full bilingual support, comprehensive testing
Expected Time: 20 hours
Success: 80%+ test coverage, all languages working

5.1 Extract All Strings (3 hours)
Create translations.ts:

Structure:

Requirements:

 Every visible text is translated
 All 3 languages complete
 No hardcoded strings
 Consistent terminology
✅ Verification:

 TypeScript strict mode passes
 All keys present in all languages
 No missing translations
5.2 Implement RTL Support (3 hours)
For Arabic:

Create RTL handling in components:

Test Arabic:

 All text right-aligned
 Layout mirrored properly
 Icons positioned correctly
 Lists scroll correctly
 Input fields work
✅ Verification:

 Arabic display correct
 Layout mirrors perfectly
 No cut-off text
 Numbers display correctly
5.3 Unit Tests (6 hours)
Create test suite in __tests__/:

Calculator Tests (2 hours)

Component Tests (2 hours)

Integration Tests (2 hours)

Coverage Target: 80%+

✅ Verification:

5.4 Manual Testing (5 hours)
Test on Real Devices:

iPhone Testing:

 iPhone SE (375px)
 iPhone 12 (390px)
 iPhone 14 (430px)
Test in portrait and landscape
Test all features
Note any issues
Android Testing:

 Pixel 4a (small)
 Pixel 6 (standard)
 Pixel 7 (large)
Test in portrait and landscape
Test all features
Note any issues
Test All Features:

 Calculate name
 View results
 Save favorite
 View history
 Delete history
 Change language
 Toggle dark mode
 Go offline/online
 Change abjad system
Bug Tracking:

Document each bug found
Prioritize by severity
Fix before next phase
✅ Verification:

 No crashes
 All features work
 Smooth performance
 < 100MB memory used
5.5 Performance Optimization (3 hours)
Optimize Bundle:

 Remove unused imports
 Check bundle size < 80MB
 Lazy load screens
Optimize Rendering:

 Use React.memo for expensive components
 Optimize FlatList rendering
 Avoid unnecessary re-renders
Memory Management:

 Limit history to 50 items
 Limit favorites to 20 items
 Clear unused resources
Run Profiler:

✅ Verification:

 Bundle < 80MB
 Memory < 100MB
 No slow screens
 Calculations < 50ms
PHASE 6: Final Polish & Deployment (Week 6)
Goal: Production ready, submitted to stores
Expected Time: 15 hours
Success: App live on iOS App Store & Google Play Store

6.1 Create Assets (3 hours)
App Icons:

Splash Screen:

Store Screenshots:

Reference: Use your logo design from web app

6.2 Prepare App Store Listings (2 hours)
App Metadata:

6.3 Final Code Review (2 hours)
Checklist:

 No console.logs in production
 No TypeScript errors
 No linting errors
 All tests passing
 Remove debug code
 Check for secrets/API keys
Update Versions:

6.4 Build & Test (3 hours)
Create iOS Build:

Create Android Build:

Device Testing:

 iOS: Test on real iPhone
 Android: Test on real Android
 All features work
 No crashes
 Proper app icons shown
 Launch fast
6.5 App Store Submission (3 hours)
iOS App Store:

Android Play Store:

6.6 Post-Launch (2 hours)
Monitor:

 Check reviews on both stores
 Monitor crash reports
 Check performance metrics
 Collect user feedback
Document Success:

 Screenshots of app listings
 Download numbers
 User reviews
 App store links
Plan Next:

 Feature requests from users
 Bug fixes based on feedback
 Next version improvements
✅ COMPLETION CHECKLIST
By End of Week 1 (Phase 1):
 Project setup complete
 Calculator engine ported
 Types defined
 Navigation structure ready
 Tests passing
By End of Week 3 (Phase 2-3):
 Input screen complete
 Results screen complete
 Full calculation flow working
 History & favorites working
 Offline support working
By End of Week 4 (Phase 4):
 Dark mode working
 All animations smooth
 Polish complete
 Responsive on all sizes
 Splash screen showing
By End of Week 5 (Phase 5):
 All strings translated
 RTL working for Arabic
 80%+ test coverage
 All manual tests passing
 Performance optimized
By End of Week 6 (Phase 6):
 Assets created
 Builds successful (iOS & Android)
 Tested on real devices
 Submitted to stores
 App live
🚀 HOW TO USE THIS PROMPT
Daily Workflow:
Morning: Check current phase, identify today's tasks
Work: Follow implementation requirements
Test: Verify with checklist items
Commit: git commit -m "task: [task description]"
Report: Update progress tracking
Stuck? Check:
Wrong phase? → Verify you're in correct week
Code issue? → Reference QUICK_CODE_SNIPPETS.md
Design question? → Reference IMPLEMENTATION_GUIDE.md
Progress check? → Reference DETAILED_CHECKLIST.md
Can't find answer? → Reference DOCUMENT_INDEX.md
Success Formula:
Created: December 24, 2025
Status: 🟢 Ready to Execute
Total Phases: 6
Total Duration: 6 weeks
Success Rate: 95%+ (following this prompt)

Ready to start? Begin with PHASE 1 today! 🚀
