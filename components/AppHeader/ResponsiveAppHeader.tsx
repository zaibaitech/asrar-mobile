import React from 'react';
import { ImageSourcePropType, useWindowDimensions } from 'react-native';
import appLogo from '../../assets/images/logo_1024_transparent.png';
import AppHeader from './AppHeader';
import AppHeaderTablet from './AppHeaderTablet';

interface ResponsiveAppHeaderProps {
  logoSource?: ImageSourcePropType;
  currentLanguage: 'EN' | 'FR' | 'AR';
  onLanguageChange: (lang: 'EN' | 'FR' | 'AR') => void;
  onProfilePress: () => void;
  onMenuPress: () => void;
  onHistoryPress?: () => void;
  showLanguageSelector?: boolean;
  backgroundColor?: string;
  tabletBreakpoint?: number; // Default: 768px
  showProfileIcon?: boolean; // New: Show profile icon in header
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
  showProfileIcon = true,
  ...props
}: ResponsiveAppHeaderProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= tabletBreakpoint;
  const logoSource: ImageSourcePropType = props.logoSource ?? appLogo;

  if (isTablet) {
    return <AppHeaderTablet {...props} logoSource={logoSource} showProfileIcon={showProfileIcon} />;
  }

  return <AppHeader {...props} logoSource={logoSource} showProfileIcon={showProfileIcon} />;
}
