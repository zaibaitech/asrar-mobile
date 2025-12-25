/**
 * CollapsibleSection - Accordion component for info sections
 */

import { LinearGradient } from 'expo-linear-gradient';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CollapsibleSectionProps {
  title: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  tintColor: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function CollapsibleSection({
  title,
  icon: IconComponent,
  tintColor,
  open,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onToggle} activeOpacity={0.75}>
        <LinearGradient colors={[`${tintColor}28`, `${tintColor}12`]} style={styles.header}>
          <View style={styles.headerRow}>
            <IconComponent size={20} color={tintColor} />
            <Text style={styles.title}>{title}</Text>
          </View>
          {open ? <ChevronUp size={20} color={tintColor} /> : <ChevronDown size={20} color={tintColor} />}
        </LinearGradient>
      </TouchableOpacity>

      {open && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
  },
  header: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 4,
  },
});
