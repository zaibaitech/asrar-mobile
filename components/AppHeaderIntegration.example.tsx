/**
 * AppHeader Integration Guide
 * 
 * This file demonstrates how to integrate the AppHeader component
 * across your Asrār Everyday mobile app screens.
 */

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppHeader from '../components/AppHeader';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * OPTION 1: Using with React Navigation Custom Header
 * 
 * Add this to your navigation stack configuration:
 */

// In your navigation setup file (e.g., navigation/index.tsx)
export function configureNavigationWithHeader() {
  return {
    screenOptions: {
      header: (props: any) => <NavigationHeader {...props} />,
    },
  };
}

function NavigationHeader({ navigation }: any) {
  const { language, setLanguage } = useLanguage();

  return (
    <AppHeader
      currentLanguage={language === 'en' ? 'EN' : 'FR'}
      onLanguageChange={(lang) => setLanguage(lang.toLowerCase() as 'en' | 'fr')}
      onProfilePress={() => navigation.navigate('Profile')}
      onClockPress={() => navigation.navigate('DivineTiming')}
      onMenuPress={() => navigation.toggleDrawer?.() || navigation.openDrawer?.()}
    />
  );
}

/**
 * OPTION 2: Using as Layout Component in Individual Screens
 * 
 * Wrap each screen with the header:
 */

export function HomeScreenWithHeader() {
  const navigation = useNavigation();
  const { language, setLanguage } = useLanguage();

  return (
    <View style={styles.screenContainer}>
      <AppHeader
        currentLanguage={language === 'en' ? 'EN' : 'FR'}
        onLanguageChange={(lang) => setLanguage(lang.toLowerCase() as 'en' | 'fr')}
        onProfilePress={() => navigation.navigate('Profile' as never)}
        onClockPress={() => navigation.navigate('DivineTiming' as never)}
        onMenuPress={() => (navigation as any).toggleDrawer?.()}
      />
      
      {/* Your screen content */}
      <View style={styles.content}>
        {/* Screen content goes here */}
      </View>
    </View>
  );
}

/**
 * OPTION 3: Using in Tab Navigation Layout
 * 
 * Create a wrapper component for tab screens:
 */

interface ScreenLayoutProps {
  children: React.ReactNode;
  showLanguageSelector?: boolean;
}

export function ScreenLayout({ children, showLanguageSelector = true }: ScreenLayoutProps) {
  const navigation = useNavigation();
  const { language, setLanguage } = useLanguage();

  return (
    <View style={styles.screenContainer}>
      <AppHeader
        currentLanguage={language === 'en' ? 'EN' : 'FR'}
        onLanguageChange={(lang) => setLanguage(lang.toLowerCase() as 'en' | 'fr')}
        onProfilePress={() => navigation.navigate('Profile' as never)}
        onClockPress={() => navigation.navigate('DivineTiming' as never)}
        onMenuPress={() => (navigation as any).openDrawer?.()}
        showLanguageSelector={showLanguageSelector}
      />
      {children}
    </View>
  );
}

/**
 * Usage in a screen:
 */

export function IstikharaScreen() {
  return (
    <ScreenLayout>
      {/* Your Istikhara screen content */}
    </ScreenLayout>
  );
}

/**
 * OPTION 4: Adding Logo After You Receive It
 * 
 * When you get the actual logo image:
 */

// 1. Add the logo image to your assets folder:
//    assets/images/asrar-logo.png

// 2. Import and use it:
import asrarLogo from '../assets/images/asrar-logo.png';

export function HeaderWithLogo() {
  const navigation = useNavigation();
  const { language, setLanguage } = useLanguage();

  return (
    <AppHeader
      logoSource={asrarLogo}  // Add your logo here
      currentLanguage={language === 'en' ? 'EN' : 'FR'}
      onLanguageChange={(lang) => setLanguage(lang.toLowerCase() as 'en' | 'fr')}
      onProfilePress={() => navigation.navigate('Profile' as never)}
      onClockPress={() => navigation.navigate('DivineTiming' as never)}
      onMenuPress={() => (navigation as any).openDrawer?.()}
    />
  );
}

/**
 * NAVIGATION SETUP EXAMPLE
 * 
 * Example drawer navigator setup:
 */

import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

export function AppNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        header: (props) => <NavigationHeader {...props} />,
        drawerStyle: {
          backgroundColor: '#FFFFFF',
          width: 280,
        },
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen 
        name="Istikhara" 
        component={IstikharaScreen}
        options={{ title: 'Istikhara' }}
      />
      <Drawer.Screen 
        name="NameAnalysis" 
        component={NameAnalysisScreen}
        options={{ title: 'Name Analysis' }}
      />
      <Drawer.Screen 
        name="Compatibility" 
        component={CompatibilityScreen}
        options={{ title: 'Compatibility' }}
      />
      <Drawer.Screen 
        name="SpiritualPractices" 
        component={SpiritualPracticesScreen}
        options={{ title: 'Spiritual Practices' }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Drawer.Screen 
        name="DivineTiming" 
        component={DivineTimingScreen}
        options={{ title: 'Divine Timing' }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Drawer.Screen 
        name="About" 
        component={AboutScreen}
        options={{ title: 'About' }}
      />
    </Drawer.Navigator>
  );
}

/**
 * CUSTOMIZATION EXAMPLES
 */

// Custom background color
export function CustomBackgroundHeader() {
  const navigation = useNavigation();
  const { language, setLanguage } = useLanguage();

  return (
    <AppHeader
      backgroundColor="#F9FAFB"  // Light gray background
      currentLanguage={language === 'en' ? 'EN' : 'FR'}
      onLanguageChange={(lang) => setLanguage(lang.toLowerCase() as 'en' | 'fr')}
      onProfilePress={() => navigation.navigate('Profile' as never)}
      onClockPress={() => navigation.navigate('DivineTiming' as never)}
      onMenuPress={() => (navigation as any).openDrawer?.()}
    />
  );
}

// Hide language selector on specific screens
export function HeaderWithoutLanguage() {
  const navigation = useNavigation();
  const { language, setLanguage } = useLanguage();

  return (
    <AppHeader
      showLanguageSelector={false}  // Hide language buttons
      currentLanguage={language === 'en' ? 'EN' : 'FR'}
      onLanguageChange={(lang) => setLanguage(lang.toLowerCase() as 'en' | 'fr')}
      onProfilePress={() => navigation.navigate('Profile' as never)}
      onClockPress={() => navigation.navigate('DivineTiming' as never)}
      onMenuPress={() => (navigation as any).openDrawer?.()}
    />
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
});

/**
 * TESTING CHECKLIST
 * 
 * ✓ Header displays correctly on all screen sizes
 * ✓ Language switching updates entire app
 * ✓ All icons are touchable and provide haptic feedback
 * ✓ Profile navigation works
 * ✓ Menu opens drawer/navigation
 * ✓ Clock icon navigates to timing features
 * ✓ Logo placeholder renders correctly
 * ✓ Logo swap works when real logo provided
 * ✓ Accessibility labels read correctly with screen readers
 * ✓ Works on both iOS and Android
 * ✓ Safe area insets respected on notched devices
 */
