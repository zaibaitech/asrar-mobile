/**
 * Drawer Menu Component
 * =====================
 * Side navigation drawer for app-wide settings and actions
 * 
 * Features:
 * - Profile quick view
 * - Settings access
 * - AI Settings
 * - Privacy & Data
 * - Language selection
 * - About & Help
 */

import { DarkTheme } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Animated,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  action?: () => void;
  color?: string;
  badge?: string;
}

export default function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const router = useRouter();
  const { profile, completionStatus, personalizationLevel } = useProfile();
  const { language, setLanguage, t } = useLanguage();
  
  const slideAnim = React.useRef(new Animated.Value(-300)).current;
  
  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);
  
  const handleNavigate = (route: string) => {
    onClose();
    setTimeout(() => router.push(route as any), 300);
  };
  
  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: t('drawer.profileSettings'),
      items: [
        {
          id: 'profile',
          label: t('drawer.myProfile'),
          icon: 'person',
          route: '/profile',
          badge: `${completionStatus.completionPercent}%`,
        },
        {
          id: 'ai-settings',
          label: t('drawer.aiSettings'),
          icon: 'sparkles',
          route: '/ai-settings',
          color: '#6366f1',
        },
      ],
    },
    {
      title: t('drawer.tools'),
      items: [
        {
          id: 'calculator',
          label: t('drawer.abjadCalculator'),
          icon: 'calculator',
          route: '/calculator',
        },
        {
          id: 'name-destiny',
          label: t('drawer.nameDestiny'),
          icon: 'book',
          route: '/(tabs)/name-destiny',
        },
        {
          id: 'compatibility',
          label: t('drawer.compatibility'),
          icon: 'heart',
          route: '/compatibility',
        },
        {
          id: 'istikhara',
          label: t('drawer.istikhara'),
          icon: 'moon',
          route: '/(tabs)/istikhara',
        },
        {
          id: 'divine-timing',
          label: t('drawer.divineTiming'),
          icon: 'time',
          route: '/divine-timing',
        },
      ],
    },
    {
      title: t('drawer.app'),
      items: [
        {
          id: 'about',
          label: t('drawer.about'),
          icon: 'information-circle',
          action: () => {
            onClose();
            // TODO: Open about modal or screen
          },
        },
        {
          id: 'help',
          label: t('drawer.helpTutorial'),
          icon: 'help-circle',
          action: () => {
            onClose();
            // TODO: Open help/tutorial
          },
        },
      ],
    },
  ];
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Drawer */}
        <Animated.View
          key={language}
          style={[
            styles.drawer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
          onStartShouldSetResponder={() => true}
        >
          <LinearGradient
            colors={[
              '#0f172a',
              '#1e1b4b',
              '#1A1625',
            ]}
            style={styles.drawerGradient}
          >
            <SafeAreaView style={styles.safeArea} edges={['top']}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerContent}>
                  <Text style={styles.logo}>Asrār ✦</Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={DarkTheme.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Profile Quick View */}
              <TouchableOpacity
                style={styles.profileSection}
                onPress={() => handleNavigate('/profile')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['rgba(139, 115, 85, 0.2)', 'rgba(139, 115, 85, 0.05)']}
                  style={styles.profileCard}
                >
                  <View style={styles.profileIcon}>
                    <Ionicons name="person" size={24} color="#8B7355" />
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>
                      {profile.nameAr || profile.nameLatin || t('drawer.guestUser')}
                    </Text>
                    <View style={styles.profileMeta}>
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>
                          {personalizationLevel === 0 && t('drawer.levelGuest')}
                          {personalizationLevel === 1 && t('drawer.levelBasic')}
                          {personalizationLevel === 2 && t('drawer.levelEnhanced')}
                          {personalizationLevel === 3 && t('drawer.levelFull')}
                        </Text>
                      </View>
                      {profile.derived?.element && (
                        <Text style={styles.profileElement}>
                          {profile.derived.element.charAt(0).toUpperCase() + profile.derived.element.slice(1)}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={DarkTheme.textSecondary} />
                </LinearGradient>
              </TouchableOpacity>
              
              {/* Menu Sections */}
              <ScrollView
                style={styles.menuScroll}
                showsVerticalScrollIndicator={false}
              >
                {menuSections.map((section, sectionIndex) => (
                  <View key={section.title} style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    {section.items.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.menuItem}
                        onPress={() => {
                          if (item.route) {
                            handleNavigate(item.route);
                          } else if (item.action) {
                            item.action();
                          }
                        }}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={item.icon}
                          size={22}
                          color={item.color || DarkTheme.textSecondary}
                        />
                        <Text style={styles.menuItemText}>{item.label}</Text>
                        {item.badge && (
                          <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.badge}</Text>
                          </View>
                        )}
                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color={DarkTheme.textSecondary}
                          style={styles.menuItemChevron}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
                
                {/* Language Selector */}
                <View style={styles.menuSection}>
                  <Text style={styles.sectionTitle}>{t('drawer.language')}</Text>
                  <View style={styles.languageSelector}>
                    {['en', 'fr', 'ar'].map((lang) => (
                      <TouchableOpacity
                        key={lang}
                        style={[
                          styles.languageButton,
                          language === lang && styles.languageButtonActive,
                        ]}
                        onPress={() => setLanguage(lang as 'en' | 'fr' | 'ar')}
                      >
                        <Text
                          style={[
                            styles.languageButtonText,
                            language === lang && styles.languageButtonTextActive,
                          ]}
                        >
                          {lang === 'en' && t('drawer.langEnglish')}
                          {lang === 'fr' && t('drawer.langFrench')}
                          {lang === 'ar' && t('drawer.langArabic')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                {/* App Version */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>Asrār v1.0.0</Text>
                  <Text style={styles.footerText}>{t('drawer.guestMode')}</Text>
                </View>
              </ScrollView>
            </SafeAreaView>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  drawer: {
    width: 300,
    height: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  drawerGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: DarkTheme.textPrimary,
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 4,
  },
  
  // Profile Section
  profileSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 115, 85, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    marginBottom: 4,
  },
  profileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelBadge: {
    backgroundColor: 'rgba(139, 115, 85, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8B7355',
  },
  profileElement: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  
  // Menu
  menuScroll: {
    flex: 1,
  },
  menuSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
    gap: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    color: DarkTheme.textPrimary,
  },
  menuItemChevron: {
    opacity: 0.5,
  },
  badge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6366f1',
  },
  
  // Language Selector
  languageSelector: {
    gap: 8,
  },
  languageButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  languageButtonActive: {
    backgroundColor: 'rgba(139, 115, 85, 0.2)',
    borderColor: '#8B7355',
  },
  languageButtonText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
  languageButtonTextActive: {
    color: '#8B7355',
    fontWeight: '600',
  },
  
  // Footer
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    opacity: 0.5,
  },
});
