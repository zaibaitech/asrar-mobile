import { Clock, Menu, User } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
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
  const insets = useSafeAreaInsets(); // Get safe area insets

  return (
    <View style={[styles.headerWrapper, { backgroundColor }]}>
      {/* Safe Area Spacer - pushes header below status bar/notch */}
      <View style={{ height: insets.top, backgroundColor }} />
      
      {/* Actual Header Content */}
      <View style={styles.container}>
      {/* Left Section: Logo + App Name */}
      <View style={styles.leftSection}>
        <AppLogo source={logoSource} isSmallScreen={isSmallScreen} />
        <Text style={[styles.appName, isSmallScreen && styles.appNameSmall]}>
          Asrār
        </Text>
      </View>

      {/* Right Section: Profile, Language Selector, Clock, Menu */}
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
          <User size={20} color="#6B7280" />
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
              accessibilityHint="Switch to English language"
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
              accessibilityHint="Switch to French language"
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

        {/* Clock Icon - Hidden on small screens */}
        {!isSmallScreen && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onClockPress}
            accessibilityLabel="Divine timing"
            accessibilityRole="button"
            accessibilityHint="Opens divine timing and prayer times"
            activeOpacity={0.7}
          >
            <Clock size={20} color="#6B7280" />
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
          <Menu size={22} color="#1F2937" />
        </TouchableOpacity>
      </View>
    </View>
    </View>
  );
}

// Logo Component with Placeholder
interface AppLogoProps {
  source?: ImageSourcePropType;
  isSmallScreen: boolean;
}

function AppLogo({ source, isSmallScreen }: AppLogoProps) {
  const logoSize = isSmallScreen ? 48 : 56;
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create continuous slow rotation animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 8000, // 8 seconds for one complete rotation (slow)
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  // Interpolate rotation value
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (source) {
    return (
      <Animated.View
        style={[
          styles.logoContainer,
          { 
            width: logoSize, 
            height: logoSize, 
            borderRadius: logoSize / 2,
            transform: [{ rotate: spin }]
          },
        ]}
      >
        <Image
          source={source}
          style={[styles.logoImage, { width: logoSize, height: logoSize }]}
          resizeMode="cover"
        />
      </Animated.View>
    );
  }

  // Use the sacred geometry logo with animation
  return (
    <Animated.View
      style={[
        styles.logoContainer,
        { 
          width: logoSize, 
          height: logoSize, 
          borderRadius: logoSize / 2, 
          overflow: 'hidden',
          transform: [{ rotate: spin }]
        },
      ]}
    >
      <AsrarLogo size={logoSize} variant="icon" element="aether" mono={false} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    // Wrapper that includes safe area
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    height: 70,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  logoContainer: {
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  logoImage: {
    resizeMode: 'cover',
  },

  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6B21A8',
    marginLeft: 8,
    flexShrink: 0,
  },

  appNameSmall: {
    fontSize: 20,
  },

  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  languageContainer: {
    flexDirection: 'row',
    gap: 6,
  },

  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 45,
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
    fontSize: 14,
    fontWeight: '600',
  },

  languageTextInactive: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
});
