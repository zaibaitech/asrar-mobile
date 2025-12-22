import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';

import ResponsiveAppHeader from '@/components/AppHeader';
import HistoryModal from '@/components/istikhara/HistoryModal';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
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
  const [showHistory, setShowHistory] = React.useState(false);

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
        onProfilePress={() => router.push('/modal')}
        onHistoryPress={() => setShowHistory(true)}
        onMenuPress={() => {
          // Open menu/drawer when implemented
          console.log('Menu pressed - Navigation drawer coming soon');
        }}
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
      initialRouteName="istikhara"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        header: () => <CustomHeader />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.calculator'),
          tabBarIcon: ({ color }) => <TabBarIcon name="calculator" color={color} />,
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
        name="two"
        options={{
          title: t('nav.guidance'),
          tabBarIcon: ({ color }) => <TabBarIcon name="compass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="results"
        options={{
          href: null, // Hide from tab bar
          title: 'Results',
        }}
      />
    </Tabs>
  );
}
