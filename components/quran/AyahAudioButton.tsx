/**
 * Ayah Audio Button
 * Simple play/pause button that controls surah-level audio
 * No loading - instant playback via seek
 */

import { DarkTheme, Spacing } from '@/constants/DarkTheme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface AyahAudioButtonProps {
  ayahNumber: number;
  isPlaying: boolean;
  isCurrentAyah: boolean;
  onPlay: () => void;
  onPause: () => void;
}

export function AyahAudioButton({
  ayahNumber,
  isPlaying,
  isCurrentAyah,
  onPlay,
  onPause,
}: AyahAudioButtonProps) {
  const handlePress = () => {
    if (isCurrentAyah && isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const isActive = isCurrentAyah && isPlaying;

  return (
    <TouchableOpacity
      style={[styles.button, isActive && styles.buttonActive]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isActive ? 'pause' : 'play'}
        size={18}
        color={isActive ? '#3b82f6' : DarkTheme.textPrimary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DarkTheme.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  buttonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3b82f6',
  },
});
