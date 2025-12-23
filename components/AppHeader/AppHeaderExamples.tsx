/**
 * AppHeader Examples - Visual Comparison of All Variants
 * 
 * This file demonstrates the three header variants:
 * 1. centered - Spiritual screens (recommended)
 * 2. minimal - Ultra-clean, title only
 * 3. default - Original left-aligned design
 */

import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppHeader from './AppHeader';

export default function AppHeaderExamples() {
  const [language, setLanguage] = useState<'EN' | 'FR'>('EN');

  const handlePress = (action: string) => {
    console.log(`${action} pressed`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Example 1: Centered Variant (Recommended for Home/Spiritual) */}
      <View style={styles.exampleSection}>
        <Text style={styles.exampleTitle}>Centered Variant (Recommended)</Text>
        <Text style={styles.exampleDescription}>
          Matches Home page gradient, muted purple accent, compact 56px height
        </Text>
        <AppHeader
          variant="centered"
          currentLanguage={language}
          onLanguageChange={setLanguage}
          onMenuPress={() => handlePress('Menu')}
          onProfilePress={() => handlePress('Profile')}
          showLanguageSelector={true}
        />
      </View>

      {/* Example 2: Centered with Subtitle */}
      <View style={styles.exampleSection}>
        <Text style={styles.exampleTitle}>Centered + Subtitle</Text>
        <Text style={styles.exampleDescription}>
          Shows optional Arabic subtitle: ʿIlm al-Ḥurūf & ʿAdad
        </Text>
        <AppHeader
          variant="centered"
          currentLanguage={language}
          onLanguageChange={setLanguage}
          onMenuPress={() => handlePress('Menu')}
          onProfilePress={() => handlePress('Profile')}
          showSubtitle={true}
        />
      </View>

      {/* Example 3: Minimal Variant */}
      <View style={styles.exampleSection}>
        <Text style={styles.exampleTitle}>Minimal Variant</Text>
        <Text style={styles.exampleDescription}>
          Title only, no side icons - perfect for focused spiritual practices
        </Text>
        <AppHeader
          variant="minimal"
          currentLanguage={language}
          onLanguageChange={setLanguage}
          onMenuPress={() => handlePress('Menu')}
          onProfilePress={() => handlePress('Profile')}
        />
      </View>

      {/* Example 4: Default Variant */}
      <View style={styles.exampleSection}>
        <Text style={styles.exampleTitle}>Default Variant (Original)</Text>
        <Text style={styles.exampleDescription}>
          Left-aligned logo + app name, full icon set, white background
        </Text>
        <AppHeader
          variant="default"
          currentLanguage={language}
          onLanguageChange={setLanguage}
          onProfilePress={() => handlePress('Profile')}
          onMenuPress={() => handlePress('Menu')}
          onHistoryPress={() => handlePress('History')}
          backgroundColor="#FFFFFF"
        />
      </View>

      {/* Design Notes */}
      <View style={styles.notesSection}>
        <Text style={styles.notesTitle}>🎨 Design Notes</Text>
        
        <Text style={styles.noteHeading}>Color Specifications:</Text>
        <Text style={styles.noteText}>
          • Background Gradient: #0f172a → #1e1b4b → rgba(26, 22, 37, 0.95)
        </Text>
        <Text style={styles.noteText}>
          • Active Language Button: #6B5CA5 (muted purple)
        </Text>
        <Text style={styles.noteText}>
          • Text Primary: #FFFFFF
        </Text>
        <Text style={styles.noteText}>
          • Text Secondary: rgba(255, 255, 255, 0.6)
        </Text>

        <Text style={styles.noteHeading}>Height Comparison:</Text>
        <Text style={styles.noteText}>
          • Centered/Minimal: 56px (compact)
        </Text>
        <Text style={styles.noteText}>
          • Default: 60px (standard)
        </Text>

        <Text style={styles.noteHeading}>When to Use:</Text>
        <Text style={styles.noteText}>
          • Centered: Home, Istikhara, Prayer Times (spiritual screens)
        </Text>
        <Text style={styles.noteText}>
          • Minimal: Meditation, focused practices
        </Text>
        <Text style={styles.noteText}>
          • Default: Calculator, Settings, Profile (utility screens)
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  exampleSection: {
    marginBottom: 32,
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginHorizontal: 16,
    marginBottom: 4,
    marginTop: 16,
  },
  exampleDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginHorizontal: 16,
    marginBottom: 12,
    lineHeight: 20,
  },
  notesSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    marginBottom: 40,
  },
  notesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  noteHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 6,
  },
  noteText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginLeft: 8,
  },
});
