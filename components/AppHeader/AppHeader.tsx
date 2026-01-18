import { useProfile } from '@/contexts/ProfileContext';
import { LinearGradient } from 'expo-linear-gradient';
import { History, Menu, User } from 'lucide-react-native';
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
import AsrarLogo, { ElementType } from '../AsrarLogo';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AppHeaderProps {
  logoSource?: ImageSourcePropType;
  currentLanguage: 'EN' | 'FR' | 'AR';
  onLanguageChange: (lang: 'EN' | 'FR' | 'AR') => void;
  onProfilePress: () => void;
  onMenuPress: () => void;
  onHistoryPress?: () => void;
  showLanguageSelector?: boolean;
  backgroundColor?: string;
  variant?: 'default' | 'centered' | 'minimal'; // New: Choose header style
  showSubtitle?: boolean; // New: Optional subtitle
  showProfileIcon?: boolean; // New: Show profile icon in header
}

export default function AppHeader({
  logoSource,
  currentLanguage,
  onLanguageChange,
  onProfilePress,
  onMenuPress,
  onHistoryPress,
  showLanguageSelector = true,
  backgroundColor = '#FFFFFF',
  variant = 'centered', // Default to new centered style
  showSubtitle = false,
  showProfileIcon = true,
}: AppHeaderProps) {
  const isSmallScreen = SCREEN_WIDTH < 350;
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  const logoElement = (profile.derived?.element ?? 'aether') as ElementType;

  // Centered/Minimal variant - matches Home page aesthetic
  if (variant === 'centered' || variant === 'minimal') {
    return (
      <LinearGradient
        colors={[
          '#0f172a', // Deep navy blue (matching Home)
          '#1e1b4b', // Deep purple
          'rgba(26, 22, 37, 0.95)', // Theme background
        ]}
        style={styles.headerWrapperGradient}
      >
        {/* Safe Area Top Spacer */}
        <View style={{ height: insets.top }} />
        
        {/* Header Content - Centered Design */}
        <View style={styles.centeredContainer}>
          {/* Left Icon */}
          {variant === 'centered' && (
            <TouchableOpacity
              style={styles.sideIconButton}
              onPress={onMenuPress}
              accessibilityLabel="Menu"
              accessibilityRole="button"
              activeOpacity={0.7}
            >
              <Menu size={20} color="rgba(255, 255, 255, 0.7)" strokeWidth={2} />
            </TouchableOpacity>
          )}

          {/* Center Section - Logo + Title */}
          <View style={styles.centerSection}>
            <View style={styles.titleRow}>
              <AppLogo
                source={logoSource}
                isSmallScreen={isSmallScreen}
                element={logoElement}
              />
              <Text style={styles.centeredTitle}>Asrariya</Text>
            </View>
            {showSubtitle && (
              <Text style={styles.centeredSubtitle}>ʿIlm al-Ḥurūf & ʿAdad</Text>
            )}
          </View>

          {/* Right Icons */}
          {variant === 'centered' && (
            <View style={styles.centeredRightSection}>
              {showLanguageSelector && (
                <View style={styles.languageContainerMinimal}>
                  <TouchableOpacity
                    style={[
                      styles.languageButtonMinimal,
                      currentLanguage === 'EN' && styles.languageButtonMinimalActive,
                    ]}
                    onPress={() => onLanguageChange('EN')}
                    accessibilityLabel="English"
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.languageTextMinimal,
                        currentLanguage === 'EN' && styles.languageTextMinimalActive,
                      ]}
                    >
                      EN
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.languageButtonMinimal,
                      currentLanguage === 'FR' && styles.languageButtonMinimalActive,
                    ]}
                    onPress={() => onLanguageChange('FR')}
                    accessibilityLabel="French"
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.languageTextMinimal,
                        currentLanguage === 'FR' && styles.languageTextMinimalActive,
                      ]}
                    >
                      FR
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Profile Icon */}
              {showProfileIcon && (
                <TouchableOpacity
                  style={styles.profileIconButton}
                  onPress={onProfilePress}
                  accessibilityLabel="Profile"
                  accessibilityRole="button"
                  activeOpacity={0.7}
                >
                  <User size={18} color="rgba(139, 115, 85, 0.9)" strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </LinearGradient>
    );
  }

  // Default variant - original left-aligned design
  return (
    <View style={[styles.headerWrapper, { backgroundColor }]}>
      {/* Safe Area Top Spacer */}
      <View style={{ height: insets.top, backgroundColor }} />
      
      {/* Header Content */}
      <View style={styles.container}>
        {/* Left Section: Logo + App Name */}
        <View style={styles.leftSection}>
          <AppLogo source={logoSource} isSmallScreen={isSmallScreen} element={logoElement} />
          <Text style={[styles.appName, isSmallScreen && styles.appNameSmall]}>
            Asrariya
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

          {/* History Icon */}
          {onHistoryPress && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onHistoryPress}
              accessibilityLabel="Calculation history"
              accessibilityRole="button"
              accessibilityHint="View saved calculations"
              activeOpacity={0.7}
            >
              <History size={18} color="#6B7280" strokeWidth={2} />
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
  element: ElementType;
  backgroundColor?: string;
  borderColor?: string;
}

function AppLogo({ source, isSmallScreen, element, backgroundColor, borderColor }: AppLogoProps) {
  const logoSize = isSmallScreen ? 44 : 52;
  const logoRadius = logoSize / 2;
  const containerStyle = [
    styles.logoContainer,
    { width: logoSize, height: logoSize, borderRadius: logoRadius },
    backgroundColor ? { backgroundColor } : null,
    borderColor ? { borderColor, borderWidth: 1 } : null,
  ];

  if (source) {
    return (
      <View style={containerStyle}>
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
    <View style={containerStyle}>
      <AsrarLogo size={logoSize} variant="icon" element={element} mono={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  // ==================== CENTERED/MINIMAL VARIANT ====================
  headerWrapperGradient: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  centeredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56, // Compact height
  },

  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  centeredTitle: {
    fontSize: 20,
    fontWeight: '600', // Semi-bold
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  centeredSubtitle: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.8,
    marginTop: 2,
    textAlign: 'center',
  },

  sideIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  centeredRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  languageContainerMinimal: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  languageButtonMinimal: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    minWidth: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  languageButtonMinimalActive: {
    backgroundColor: '#6B5CA5', // Muted purple - matches recommendation
  },

  languageTextMinimal: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  languageTextMinimalActive: {
    color: '#FFFFFF',
  },

  profileIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 115, 85, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 115, 85, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ==================== DEFAULT VARIANT ====================
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
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  logoImage: {
    width: '100%',
    height: '100%',
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
