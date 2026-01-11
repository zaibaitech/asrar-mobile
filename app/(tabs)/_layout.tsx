import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter, useSegments } from 'expo-router';
import React from 'react';

import ResponsiveAppHeader from '@/components/AppHeader';
import DrawerMenu from '@/components/DrawerMenu';
import HistoryModal from '@/components/istikhara/HistoryModal';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { SavedCalculation } from '@/services/HistoryService';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

// Custom header component for tabs
function CustomHeader() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const segments = useSegments();
  const [showHistory, setShowHistory] = React.useState(false);
  const [showDrawer, setShowDrawer] = React.useState(false);

  // Hide header on name-destiny screens (they have their own DestinyHeader)
  const isNameDestinyScreen = segments.includes('name-destiny');
  
  if (isNameDestinyScreen) {
    return null;
  }

  const handleLoadFromHistory = (saved: SavedCalculation) => {
    router.push({
      pathname: '/(tabs)/results',
      params: {
        data: JSON.stringify(saved.result),
        personName: saved.personName,
        motherName: saved.motherName,
      },
    });
    setShowHistory(false);
  };

  return (
    <>
      <ResponsiveAppHeader
        currentLanguage={language === 'en' ? 'EN' : 'FR'}
        onLanguageChange={(lang) => setLanguage(lang.toLowerCase() as 'en' | 'fr' | 'ar')}
        onProfilePress={() => router.push('/profile')}
        onHistoryPress={() => setShowHistory(true)}
        onMenuPress={() => setShowDrawer(true)}
      />
      <DrawerMenu
        visible={showDrawer}
        onClose={() => setShowDrawer(false)}
      />
      <HistoryModal
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectCalculation={handleLoadFromHistory}
      />
    </>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useLanguage();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        // Dark theme tab bar styling
        tabBarActiveTintColor: '#6B5CA5', // Muted purple (matches header)
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)', // Faded white
        tabBarStyle: {
          backgroundColor: '#1A1625', // Dark theme background
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.1)', // Subtle border
          elevation: 0, // Remove Android shadow
          shadowOpacity: 0, // Remove iOS shadow
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.3,
        },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        header: () => <CustomHeader />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.home'),
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="istikhara"
        options={{
          title: t('nav.advanced'),
          tabBarIcon: ({ color }) => <TabBarIcon name="moon-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: t('nav.calculator'),
          tabBarIcon: ({ color }) => <TabBarIcon name="calculator" color={color} />,
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: 'Quran',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          href: null, // Hidden - replaced by direct module access from Home
          title: t('nav.guidance'),
        }}
      />
      <Tabs.Screen
        name="name-destiny"
        options={{
          href: null, // Hide from tab bar - accessed via navigation only
          title: 'Name Destiny',
        }}
      />
      <Tabs.Screen
        name="moment-alignment-detail"
        options={{
          href: null, // Hide from tab bar
          title: 'Moment Alignment',
        }}
      />
      <Tabs.Screen
        name="daily-guidance-details"
        options={{
          href: null, // Hide from tab bar
          title: 'Daily Guidance',
        }}
      />
      <Tabs.Screen
        name="results"
        options={{
          href: null, // Hide from tab bar
          title: 'Results',
        }}
      />
      <Tabs.Screen
        name="qibla"
        options={{
          href: null, // Hide from tab bar - accessed via navigation only
          title: 'Qibla',
        }}
      />
      <Tabs.Screen
        name="divine-timing"
        options={{
          href: null, // Hide from tab bar - accessed via navigation only
          title: 'Divine Timing',
        }}
      />
      <Tabs.Screen
        name="divine-timing-insights"
        options={{
          href: null, // Hide from tab bar - accessed via navigation only
          title: 'Divine Timing Insights',
        }}
      />
      <Tabs.Screen
        name="quran/bookmarks"
        options={{
          href: null, // Hide bookmarks route from bottom tabs
          title: 'Quran Bookmarks',
        }}
      />
      <Tabs.Screen
        name="quran/[surahNumber]"
        options={{
          href: null, // Hide individual surah route from bottom tabs
          title: 'Quran Surah Detail',
        }}
      />
      <Tabs.Screen
        name="istikhara-prayer-guide"
        options={{
          href: null, // Hide from tab bar - accessed via navigation only
          title: 'Istikhara Guide',
        }}
      />
      <Tabs.Screen
        name="daily-checkin"
        options={{
          href: null, // Hide from tab bar - accessed via navigation only
          title: 'Daily Check-In',
        }}
      />
      <Tabs.Screen
        name="planet-detail"
        options={{
          href: null, // 🔒 Frozen for launch - redirects to coming soon
          title: 'Planet Details',
        }}
      />
      <Tabs.Screen
        name="planetary-coming-soon"
        options={{
          href: null, // Placeholder screen for frozen planetary module
          title: 'Planetary Module',
        }}
      />
    </Tabs>
  );
}
