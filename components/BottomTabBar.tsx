import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';

interface TabConfig {
  name: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  route: string;
  labelKey: string;
}

const TABS: TabConfig[] = [
  { name: 'home', icon: 'home', route: '/(tabs)', labelKey: 'nav.home' },
  { name: 'istikhara', icon: 'moon-o', route: '/(tabs)/istikhara', labelKey: 'nav.advanced' },
  { name: 'calculator', icon: 'calculator', route: '/(tabs)/calculator', labelKey: 'nav.calculator' },
  { name: 'guidance', icon: 'compass', route: '/(tabs)/two', labelKey: 'nav.guidance' },
];

interface BottomTabBarProps {
  activeTab?: string;
}

export default function BottomTabBar({ activeTab }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => router.push(tab.route as any)}
            activeOpacity={0.7}
          >
            <FontAwesome
              name={tab.icon}
              size={28}
              color={isActive ? '#6B5CA5' : 'rgba(255, 255, 255, 0.4)'}
              style={styles.icon}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {t(tab.labelKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1A1625',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  icon: {
    marginBottom: -3,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 4,
  },
  activeLabel: {
    color: '#6B5CA5',
  },
});
