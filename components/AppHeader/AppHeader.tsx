import { Clock, Menu, User } from 'lucide-react-native';
import React from 'react';
import {
    Dimensions,
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsrarLogo from '../AsrarLogo';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AppHeaderProps {
  logoSource?: ImageSourcePropType;
  currentLanguage: 'EN' | 'FR';
  onLanguageChange: (lang: 'EN' | 'FR') => void;
  onProfilePress: () => void;
  onClockPress: () => void;
  onMenuPress: () => void;
  showLanguageSelector?: boolean;
  backgroundColor?: string;
}

export default function AppHeader({
  logoSource,
  currentLanguage,
  onLanguageChange,
  onProfilePress,
  onClockPress,
  onMenuPress,
  showLanguageSelector = true,
  backgroundColor = '#FFFFFF',
}: AppHeaderProps) {
  const isSmallScreen = SCREEN_WIDTH < 350;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerWrapper, { backgroundColor }]}>
      {/* Safe Area Top Spacer */}
      <View style={{ height: insets.top, backgroundColor }} />
      
      {/* Header Content */}
      <View style={styles.container}>
        {/* Left Section: Logo + App Name */}
        <View style={styles.leftSection}>
          <AppLogo source={logoSource} isSmallScreen={isSmallScreen} />
          <Text style={[styles.appName, isSmallScreen && styles.appNameSmall]}>
            Asrār
          </Text>
        </View>

        {/* Right Section: Icons and Controls */}
        <View style={styles.rightSection}>
          {/* Profile Icon */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onProfilePress}
            accessibilityLabel="Profile"
            accessibilityRole="button"
            accessibilityHint="Opens your profile settings"
            activeOpacity={0.7}
          >
            <User size={18} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>

          {/* Language Selector */}
          {showLanguageSelector && (
            <View style={styles.languageContainer}>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  currentLanguage === 'EN'
                    ? styles.languageButtonActive
                    : styles.languageButtonInactive,
                ]}
                onPress={() => onLanguageChange('EN')}
                accessibilityLabel="English language"
                accessibilityRole="button"
                accessibilityState={{ selected: currentLanguage === 'EN' }}
                activeOpacity={0.7}
              >
                <Text
                  style={
                    currentLanguage === 'EN'
                      ? styles.languageTextActive
                      : styles.languageTextInactive
                  }
                >
                  EN
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.languageButton,
                  currentLanguage === 'FR'
                    ? styles.languageButtonActive
                    : styles.languageButtonInactive,
                ]}
                onPress={() => onLanguageChange('FR')}
                accessibilityLabel="French language"
                accessibilityRole="button"
                accessibilityState={{ selected: currentLanguage === 'FR' }}
                activeOpacity={0.7}
              >
                <Text
                  style={
                    currentLanguage === 'FR'
                      ? styles.languageTextActive
                      : styles.languageTextInactive
                  }
                >
                  FR
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Clock Icon */}
          {!isSmallScreen && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onClockPress}
              accessibilityLabel="Divine timing"
              accessibilityRole="button"
              accessibilityHint="Opens divine timing and prayer times"
              activeOpacity={0.7}
            >
              <Clock size={18} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          )}

          {/* Menu Icon */}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={onMenuPress}
            accessibilityLabel="Menu"
            accessibilityRole="button"
            accessibilityHint="Opens navigation menu"
            activeOpacity={0.7}
          >
            <Menu size={20} color="#1F2937" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Logo Component
interface AppLogoProps {
  source?: ImageSourcePropType;
  isSmallScreen: boolean;
}

function AppLogo({ source, isSmallScreen }: AppLogoProps) {
  const logoSize = isSmallScreen ? 36 : 42;
  const logoRadius = logoSize / 2;

  if (source) {
    return (
      <View
        style={[
          styles.logoContainer,
          { width: logoSize, height: logoSize, borderRadius: logoRadius },
        ]}
      >
        <Image
          source={source}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
    );
  }

  // Use AsrarLogo component instead of placeholder
  return (
    <View
      style={{
        width: logoSize,
        height: logoSize,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <AsrarLogo size={logoSize} variant="icon" element="aether" mono={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    minHeight: 60,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
    minWidth: 0,
    maxWidth: '50%',
  },

  logoContainer: {
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  logoImage: {
    width: '70%',
    height: '70%',
  },

  logoPlaceholderText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6B21A8',
  },

  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6B21A8',
    marginLeft: 8,
    letterSpacing: 0.3,
    flexShrink: 1,
  },

  appNameSmall: {
    fontSize: 16,
  },

  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 0,
  },

  languageContainer: {
    flexDirection: 'row',
    gap: 4,
  },

  languageButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    minWidth: 40,
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
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  languageTextInactive: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
