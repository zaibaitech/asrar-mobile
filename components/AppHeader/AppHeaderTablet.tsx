import { Clock, Menu, User } from 'lucide-react-native';
import React from 'react';
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import AsrarLogo from '../AsrarLogo';

interface AppHeaderTabletProps {
  logoSource?: ImageSourcePropType;
  currentLanguage: 'EN' | 'FR' | 'AR';
  onLanguageChange: (lang: 'EN' | 'FR' | 'AR') => void;
  onProfilePress: () => void;
  onClockPress: () => void;
  onMenuPress: () => void;
  showLanguageSelector?: boolean;
  backgroundColor?: string;
}

/**
 * Tablet-optimized version of AppHeader with larger sizing (1.2x scale)
 * Automatically used when device width > 768px
 */
export default function AppHeaderTablet({
  logoSource,
  currentLanguage,
  onLanguageChange,
  onProfilePress,
  onClockPress,
  onMenuPress,
  showLanguageSelector = true,
  backgroundColor = '#FFFFFF',
}: AppHeaderTabletProps) {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  // Tablet scaling factor
  const scale = isTablet ? 1.2 : 1;
  const logoSize = Math.round(56 * scale);
  const iconSize = Math.round(48 * scale);
  const fontSize = Math.round(30 * scale);
  const langFontSize = Math.round(16 * scale);

  return (
    <View style={[styles.container, { backgroundColor, paddingHorizontal: 24 * scale }]}>
      {/* Left Section: Logo + App Name */}
      <View style={styles.leftSection}>
        <TabletLogo source={logoSource} size={logoSize} />
        <Text style={[styles.appName, { fontSize, marginLeft: 12 * scale }]}>
          Asrār
        </Text>
      </View>

      {/* Right Section: Profile, Language Selector, Clock, Menu */}
      <View style={[styles.rightSection, { gap: 10 * scale }]}>
        {/* Profile Icon */}
        <TouchableOpacity
          style={[styles.iconButton, { width: iconSize, height: iconSize, borderRadius: iconSize / 2 }]}
          onPress={onProfilePress}
          accessibilityLabel="Profile"
          accessibilityRole="button"
          accessibilityHint="Opens your profile settings"
          activeOpacity={0.7}
        >
          <User size={Math.round(24 * scale)} color="#6B7280" />
        </TouchableOpacity>

        {/* Language Selector */}
        {showLanguageSelector && (
          <View style={[styles.languageContainer, { gap: 10 * scale }]}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                {
                  paddingHorizontal: 14 * scale,
                  paddingVertical: 10 * scale,
                  borderRadius: 12 * scale,
                  minWidth: 56 * scale,
                },
                currentLanguage === 'EN'
                  ? styles.languageButtonActive
                  : styles.languageButtonInactive,
              ]}
              onPress={() => onLanguageChange('EN')}
              accessibilityLabel="English language"
              accessibilityRole="button"
              accessibilityState={{ selected: currentLanguage === 'EN' }}
              accessibilityHint="Switch to English language"
              activeOpacity={0.7}
            >
              <Text
                style={[
                  currentLanguage === 'EN'
                    ? styles.languageTextActive
                    : styles.languageTextInactive,
                  { fontSize: langFontSize },
                ]}
              >
                EN
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageButton,
                {
                  paddingHorizontal: 14 * scale,
                  paddingVertical: 10 * scale,
                  borderRadius: 12 * scale,
                  minWidth: 56 * scale,
                },
                currentLanguage === 'FR'
                  ? styles.languageButtonActive
                  : styles.languageButtonInactive,
              ]}
              onPress={() => onLanguageChange('FR')}
              accessibilityLabel="French language"
              accessibilityRole="button"
              accessibilityState={{ selected: currentLanguage === 'FR' }}
              accessibilityHint="Switch to French language"
              activeOpacity={0.7}
            >
              <Text
                style={[
                  currentLanguage === 'FR'
                    ? styles.languageTextActive
                    : styles.languageTextInactive,
                  { fontSize: langFontSize },
                ]}
              >
                FR
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Clock Icon */}
        <TouchableOpacity
          style={[styles.iconButton, { width: iconSize, height: iconSize, borderRadius: iconSize / 2 }]}
          onPress={onClockPress}
          accessibilityLabel="Divine timing"
          accessibilityRole="button"
          accessibilityHint="Opens divine timing and prayer times"
          activeOpacity={0.7}
        >
          <Clock size={Math.round(24 * scale)} color="#6B7280" />
        </TouchableOpacity>

        {/* Menu Icon */}
        <TouchableOpacity
          style={[styles.menuButton, { marginLeft: 4 * scale, padding: 10 * scale }]}
          onPress={onMenuPress}
          accessibilityLabel="Menu"
          accessibilityRole="button"
          accessibilityHint="Opens navigation menu"
          activeOpacity={0.7}
        >
          <Menu size={Math.round(28 * scale)} color="#1F2937" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Tablet Logo Component
interface TabletLogoProps {
  source?: ImageSourcePropType;
  size: number;
}

function TabletLogo({ source, size }: TabletLogoProps) {
  const radius = size / 2;

  if (source) {
    return (
      <View
        style={[
          styles.logo,
          { width: size, height: size, borderRadius: radius },
        ]}
      >
        <Image
          source={source}
          style={[
            styles.logoImage,
            { width: size, height: size, borderRadius: radius },
          ]}
          resizeMode="cover"
        />
      </View>
    );
  }

  // Use the sacred geometry logo
  return (
    <View
      style={[
        styles.logo,
        { width: size, height: size, borderRadius: radius, overflow: 'hidden' },
      ]}
    >
      <AsrarLogo size={size} variant="icon" element="aether" mono={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    height: 96,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  logo: {
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoImage: {},

  appName: {
    fontWeight: '700',
    color: '#6B21A8',
  },

  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconButton: {
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuButton: {},

  languageContainer: {
    flexDirection: 'row',
  },

  languageButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  languageButtonActive: {
    backgroundColor: '#7C3AED',
  },

  languageButtonInactive: {
    backgroundColor: '#F3F4F6',
  },

  languageTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  languageTextInactive: {
    color: '#6B7280',
    fontWeight: '600',
  },
});
