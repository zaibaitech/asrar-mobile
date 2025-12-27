/**
 * AI Assistance Badge Component
 * ==============================
 * Shows when AI has assisted with wording
 */

import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme
} from 'react-native';

interface AIBadgeProps {
  /** Show the badge */
  show: boolean;
  
  /** Compact mode (small badge) */
  compact?: boolean;
}

export function AIBadge({ show, compact = false }: AIBadgeProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  if (!show) return null;
  
  const handlePress = () => {
    Alert.alert(
      'AI-Assisted Wording',
      `This guidance has been polished by AI for clarity and warmth.

The core meaning and structure come from the app's deterministic calculations. AI only improved the wording.

AI does NOT:
• Predict outcomes
• Make decisions  
• Give religious rulings
• Add new advice

Want to customize AI settings?`,
      [
        { text: 'Not Now', style: 'cancel' },
        { text: 'AI Settings', onPress: () => router.push('/ai-settings') },
      ]
    );
  };
  
  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.badgeCompact, { backgroundColor: '#ede9fe' }]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Ionicons name="sparkles" size={10} color="#7c3aed" />
        <Text style={[styles.badgeTextCompact, { color: '#7c3aed' }]}>
          AI
        </Text>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity
      style={[styles.badge, { backgroundColor: '#ede9fe' }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Ionicons name="sparkles" size={14} color="#7c3aed" />
      <Text style={[styles.badgeText, { color: '#7c3aed' }]}>
        AI-assisted wording
      </Text>
      <Ionicons name="information-circle-outline" size={14} color="#7c3aed" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  badgeCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeTextCompact: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
