import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';

import ResponsiveAppHeader from '@/components/AppHeader';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/contexts/LanguageContext';

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

  return (
    <ResponsiveAppHeader
      currentLanguage={language === 'en' ? 'EN' : 'FR'}
      onLanguageChange={(lang) => setLanguage(lang.toLowerCase() as 'en' | 'fr' | 'ar')}
      onProfilePress={() => router.push('/modal')}
      onClockPress={() => {
        // Navigate to divine timing screen when implemented
        console.log('Clock pressed - Divine timing feature coming soon');
      }}
      onMenuPress={() => {
        // Open menu/drawer when implemented
        console.log('Menu pressed - Navigation drawer coming soon');
      }}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
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
          title: 'Calculator',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="istikhara"
        options={{
          title: 'Istikhara',
          tabBarIcon: ({ color }) => <TabBarIcon name="moon-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Life Guidance',
          tabBarIcon: ({ color }) => <TabBarIcon name="compass" color={color} />,
        }}
      />
    </Tabs>
  );
}
