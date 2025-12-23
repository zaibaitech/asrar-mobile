import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DarkTheme } from '../../constants/DarkTheme';
import { CompatibilityMode } from '../../types/compatibility';

interface CompatibilityModeSwitcherProps {
  currentMode: CompatibilityMode;
  onModeChange: (mode: CompatibilityMode) => void;
  language?: 'en' | 'fr' | 'ar';
}

export function CompatibilityModeSwitcher({ 
  currentMode, 
  onModeChange,
  language = 'en'
}: CompatibilityModeSwitcherProps) {
  const isFrench = language === 'fr';
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onModeChange('transit')}
        style={styles.buttonContainer}
        activeOpacity={0.8}
      >
        {currentMode === 'transit' ? (
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="time" size={20} color="#fff" />
            <View style={styles.buttonText}>
              <Text style={styles.buttonTitleActive}>
                {isFrench ? 'Mode Transit' : 'Transit Mode'}
              </Text>
              <Text style={styles.buttonSubtitleActive}>
                {isFrench ? 'Heures Planétaires' : 'Planetary Hours'}
              </Text>
            </View>
          </LinearGradient>
        ) : (
          <View style={[styles.button, styles.buttonInactive]}>
            <Ionicons name="time-outline" size={20} color="#94a3b8" />
            <View style={styles.buttonText}>
              <Text style={styles.buttonTitleInactive}>
                {isFrench ? 'Mode Transit' : 'Transit Mode'}
              </Text>
              <Text style={styles.buttonSubtitleInactive}>
                {isFrench ? 'Heures Planétaires' : 'Planetary Hours'}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
      
      <View style={styles.separator} />
      
      <TouchableOpacity
        onPress={() => onModeChange('relationship')}
        style={styles.buttonContainer}
        activeOpacity={0.8}
      >
        {currentMode === 'relationship' ? (
          <LinearGradient
            colors={['#ec4899', '#f43f5e']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="heart" size={20} color="#fff" />
            <View style={styles.buttonText}>
              <Text style={styles.buttonTitleActive}>
                {isFrench ? 'Mode Relation' : 'Relationship Mode'}
              </Text>
              <Text style={styles.buttonSubtitleActive}>
                {isFrench ? 'Compatibilité des Noms' : 'Name Compatibility'}
              </Text>
            </View>
          </LinearGradient>
        ) : (
          <View style={[styles.button, styles.buttonInactive]}>
            <Ionicons name="heart-outline" size={20} color="#94a3b8" />
            <View style={styles.buttonText}>
              <Text style={styles.buttonTitleInactive}>
                {isFrench ? 'Mode Relation' : 'Relationship Mode'}
              </Text>
              <Text style={styles.buttonSubtitleInactive}>
                {isFrench ? 'Compatibilité des Noms' : 'Name Compatibility'}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: DarkTheme.screenBackground,
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  buttonInactive: {
    backgroundColor: DarkTheme.cardBackground,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  buttonText: {
    flex: 1,
    alignItems: 'flex-start',
  },
  buttonTitleActive: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  buttonSubtitleActive: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  buttonTitleInactive: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
  },
  buttonSubtitleInactive: {
    fontSize: 11,
    color: DarkTheme.textMuted,
    marginTop: 2,
  },
  separator: {
    width: 1,
    height: 40,
    backgroundColor: DarkTheme.borderSubtle,
  },
});
