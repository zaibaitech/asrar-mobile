/**
 * CollapsibleSection Component
 * =============================
 * A reusable collapsible/expandable section component for better UX.
 * Use this to wrap verbose content that should be hidden by default
 * but accessible on-demand.
 * 
 * Features:
 * - Smooth expand/collapse animations
 * - Customizable icon and default state
 * - Works on both iOS and Android
 * - Theme-aware styling
 */

import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CollapsibleSectionProps {
  /** Section title text */
  title: string;
  /** Content to show when expanded */
  children: React.ReactNode;
  /** Whether section starts expanded (default: false) */
  defaultExpanded?: boolean;
  /** Optional emoji/icon to show before title */
  icon?: string;
  /** Optional subtitle text */
  subtitle?: string;
  /** Hide the expand/collapse hint text */
  hideHint?: boolean;
  /** Custom container style */
  containerStyle?: object;
  /** Callback when section is toggled */
  onToggle?: (isExpanded: boolean) => void;
}

// Translation strings for hint text
const HINT_TRANSLATIONS = {
  en: { expand: 'Tap to expand', collapse: 'Tap to collapse' },
  fr: { expand: 'Appuyez pour développer', collapse: 'Appuyez pour réduire' },
  ar: { expand: 'اضغط للتوسيع', collapse: 'اضغط للطي' },
};

export default function CollapsibleSection({
  title,
  children,
  defaultExpanded = false,
  icon,
  subtitle,
  hideHint = false,
  containerStyle,
  onToggle,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { language } = useLanguage();
  const lang = (language || 'en') as 'en' | 'fr' | 'ar';

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle?.(newState);
  };

  const hintText = isExpanded 
    ? HINT_TRANSLATIONS[lang]?.collapse || HINT_TRANSLATIONS.en.collapse
    : HINT_TRANSLATIONS[lang]?.expand || HINT_TRANSLATIONS.en.expand;

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpand}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${isExpanded ? 'expanded' : 'collapsed'}`}
        accessibilityHint={hintText}
      >
        <View style={styles.headerContent}>
          {icon && (
            <Text style={styles.icon}>{icon}</Text>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && (
              <Text style={styles.subtitle}>{subtitle}</Text>
            )}
          </View>
          <View style={styles.chevronContainer}>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={DarkTheme.textSecondary}
            />
          </View>
        </View>
        {!hideHint && (
          <Text style={styles.hint}>{hintText}</Text>
        )}
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },

  header: {
    padding: Spacing.md,
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    color: DarkTheme.textPrimary,
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold as any,
  },

  subtitle: {
    color: DarkTheme.textTertiary,
    fontSize: Typography.caption,
    marginTop: 2,
  },

  chevronContainer: {
    marginLeft: Spacing.sm,
    padding: 4,
  },

  hint: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: Typography.caption,
    marginTop: 4,
  },

  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
});
