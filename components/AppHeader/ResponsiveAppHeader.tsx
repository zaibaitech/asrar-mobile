import React from 'react';
import { ImageSourcePropType, useWindowDimensions } from 'react-native';
import AppHeader from './AppHeader';
import AppHeaderTablet from './AppHeaderTablet';

interface ResponsiveAppHeaderProps {
  logoSource?: ImageSourcePropType;
  currentLanguage: 'EN' | 'FR';
  onLanguageChange: (lang: 'EN' | 'FR') => void;
  onProfilePress: () => void;
  onMenuPress: () => void;
  onHistoryPress?: () => void;
  showLanguageSelector?: boolean;
  backgroundColor?: string;
  tabletBreakpoint?: number; // Default: 768px
}

/**
 * Responsive header that automatically switches between mobile and tablet layouts
 * based on screen width.
 * 
 * Uses AppHeader for mobile devices (< 768px)
 * Uses AppHeaderTablet for tablets and larger (>= 768px)
 * 
 * @example
 * <ResponsiveAppHeader
 *   currentLanguage="EN"
 *   onLanguageChange={(lang) => setLanguage(lang)}
 *   onProfilePress={() => navigation.navigate('Profile')}
 *   onHistoryPress={() => setShowHistory(true)}
 *   onMenuPress={() => navigation.openDrawer()}
 * />
 */
export default function ResponsiveAppHeader({
  tabletBreakpoint = 768,
  ...props
}: ResponsiveAppHeaderProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= tabletBreakpoint;

  if (isTablet) {
    return <AppHeaderTablet {...props} />;
  }

  return <AppHeader {...props} />;
}
