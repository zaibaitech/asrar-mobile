/**
 * Collapsible Accordion Section
 * Reusable component for advanced/classical content
 */

import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    LayoutAnimation,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    UIManager,
    View,
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionSectionProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  accentColor?: string;
  children: React.ReactNode;
}

export function AccordionSection({
  title,
  subtitle,
  defaultOpen = false,
  accentColor = '#a78bfa',
  children,
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  return (
    <View style={[styles.container, { borderColor: `${accentColor}20` }]}>
      <Pressable
        onPress={toggleOpen}
        style={({ pressed }) => [
          styles.header,
          { backgroundColor: pressed ? 'rgba(148, 163, 184, 0.08)' : 'transparent' },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          <View style={[styles.iconCircle, { backgroundColor: `${accentColor}15` }]}>
            {isOpen ? (
              <ChevronUp size={18} color={accentColor} strokeWidth={2.5} />
            ) : (
              <ChevronDown size={18} color={accentColor} strokeWidth={2.5} />
            )}
          </View>
        </View>
      </Pressable>

      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    overflow: 'hidden',
    marginBottom: 12,
  },
  header: {
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f1f5f9',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
});
