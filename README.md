# Asrariya Mobile App

A React Native mobile application built with Expo SDK 54 for the Asrariya Everyday project. This app provides spiritual guidance through the ancient practice of Abjad numerology and Islamic spiritual practices.

## 🌙 Features

### Istikhara Module
- **Spiritual Calculation**: Calculate your Buruj (zodiac) sign based on Arabic Abjad numerology
- **Comprehensive Profile**: Get detailed insights across 5 categories:
  - **Overview**: Buruj sign, element, planet, and Abjad totals
  - **Personality**: Temperament, communication style, strengths, and challenges
  - **Career**: Recommended industries, categories, and guiding principles
  - **Blessed Day**: Best day of the week, favored activities, and Sadaqah guidance
  - **Spiritual**: Divine names, dhikr practices, and timing recommendations
- **Interactive Counter**: Built-in dhikr counter with haptic feedback
- **Export & Share**: Generate PDF reports and share via native sharing
- **History**: Automatic saving of calculations to local storage

## 🛠 Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript (strict mode)
- **Navigation**: Expo Router + React Navigation Material Top Tabs
- **UI**: React Native components with custom styling
- **State Management**: React Hooks
- **Storage**: AsyncStorage
- **HTTP Client**: Axios
- **PDF Generation**: expo-print
- **Sharing**: expo-sharing
- **Haptics**: expo-haptics
- **Gradients**: expo-linear-gradient

## 📁 Project Structure

```
asrar-mobile/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── istikhara.tsx         # Istikhara landing screen
│   │   ├── index.tsx             # Home screen
│   │   └── _layout.tsx           # Tab layout configuration
│   └── istikhara/                # Istikhara module screens
│       ├── form.tsx              # Input form screen
│       └── results.tsx           # Results with 5 tabs
├── components/                   # Reusable components
│   └── istikhara/
│       └── tabs/                 # Result tab components
│           ├── OverviewTab.tsx
│           ├── PersonalityTab.tsx
│           ├── CareerTab.tsx
│           ├── BlessedDayTab.tsx
│           └── SpiritualTab.tsx
├── services/                     # API and business logic
│   └── api/
│       └── istikhara.ts          # API client and storage
├── hooks/                        # Custom React hooks
│   └── useIstikhara.ts           # Istikhara state management
├── types/                        # TypeScript definitions
│   └── istikhara.ts              # API types and interfaces
├── constants/                    # App constants
├── utils/                        # Utility functions
└── assets/                       # Images, fonts, etc.
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator
- Or Expo Go app on your physical device

### Installation

1. Clone the repository:
```bash
git clone https://github.com/zaibaitech/asrar-mobile.git
cd asrar-mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web (for testing only)
npm run web
```

## 📱 Usage

### Calculating Istikhara

1. Open the app and navigate to the **Istikhara** tab
2. Tap **"Begin Calculation"**
3. Enter the person's name and mother's name
4. Tap **"Calculate Istikhara"**
5. View your comprehensive spiritual profile across 5 tabs
6. Use the dhikr counter in the Spiritual tab
7. Export to PDF or share your results

### API Configuration

The app connects to the Asrariya Everyday API:
- **Base URL**: `https://asrar-everyday.vercel.app/api/v1`
- **Endpoint**: `/istikhara`
- **Method**: POST

## 🎨 Design System

### Colors

Element-based color scheme:
- **Fire**: `#ef4444` (Red)
- **Earth**: `#84cc16` (Green)
- **Air**: `#06b6d4` (Cyan)
- **Water**: `#3b82f6` (Blue)

Background colors:
- **Primary**: `#1a1a2e`
- **Secondary**: `#16213e`
- **Accent**: `#e94560`

### Spacing

Consistent spacing scale:
- Small: 8px
- Medium: 16px
- Large: 24px
- XLarge: 32px

## 🔐 Bundle Identifiers

- **iOS**: `com.zaibaitech.asrariya`
- **Android**: `com.zaibaitech.asrariya`

## 📦 Dependencies

### Core
- `expo` ~54.0.30
- `react` 19.1.0
- `react-native` 0.81.5

### Navigation
- `expo-router` ~6.0.21
- `@react-navigation/material-top-tabs` ^7.0.0
- `react-native-pager-view`

### Storage & Network
- `@react-native-async-storage/async-storage`
- `axios`

### UI & Interactions
- `expo-linear-gradient`
- `expo-haptics`
- `@expo/vector-icons`
- `react-native-progress`

### Sharing & Export
- `expo-print`
- `expo-sharing`

## 🧪 Testing

The app can be tested in:
- **Expo Go**: Scan QR code from `npm start`
- **iOS Simulator**: `npm run ios`
- **Android Emulator**: `npm run android`

## 🔄 State Management

The app uses React Hooks for state management:
- `useIstikhara`: Manages calculation state, API calls, and error handling
- Local state with `useState` for UI interactions
- AsyncStorage for persistent data

## 📝 TypeScript

The project uses TypeScript in strict mode with comprehensive type definitions for:
- API requests and responses
- Component props
- Hook return types
- Navigation params

## 🌐 API Integration

All API calls are handled through the `services/api/istikhara.ts` service:
- Automatic error handling
- Request timeout (15 seconds)
- History management
- Type-safe responses

## 🎯 Success Criteria

All criteria met:
- ✅ Expo project runs without errors
- ✅ Can navigate to Istikhara tab
- ✅ Can fill form and submit
- ✅ API call succeeds and shows results
- ✅ Results display in 5 tabs
- ✅ Can export/share results
- ✅ History saves to AsyncStorage
- ✅ All TypeScript types are correct
- ✅ Works in Expo Go app

## 📄 License

Copyright © 2025 Zaibai Tech

## 🤝 Contributing

This is a private project for the Asrār Everyday platform.

## 📧 Support

For issues or questions, please contact the development team.

---

Built with ❤️ by Zaibai Tech
