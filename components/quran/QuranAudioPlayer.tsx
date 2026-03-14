/**
 * Quran Audio Player Component
 * Uses expo-av for background audio playback with lock screen controls
 * 
 * Audio source: https://cdn.islamic.network/quran/audio/128/ar.alafasy/{ayah_number}.mp3
 * Reciter: Mishary Rashid Alafasy
 */

import { DarkTheme, Spacing } from '@/constants/DarkTheme';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AUDIO_BASE_URL = 'https://cdn.islamic.network/quran/audio/128/ar.alafasy';

interface QuranAudioPlayerProps {
  ayahNumber: number; // Global ayah number (1-6236)
  surahNumber: number;
  ayahInSurah: number;
  onFinish?: () => void;
  autoPlay?: boolean;
}

export function QuranAudioPlayer({
  ayahNumber,
  surahNumber,
  ayahInSurah,
  onFinish,
  autoPlay = false,
}: QuranAudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configure audio mode for background playback
  useEffect(() => {
    configureAudio();
    return () => {
      cleanupSound();
    };
  }, []);

  // Auto-play if enabled
  useEffect(() => {
    if (autoPlay && !isPlaying && !isLoading) {
      handlePlayPause();
    }
  }, [autoPlay, ayahNumber]);

  // Cleanup when ayah changes
  useEffect(() => {
    return () => {
      cleanupSound();
    };
  }, [ayahNumber]);

  async function configureAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true, // Enable background audio
        playsInSilentModeIOS: true, // Play even in silent mode
        shouldDuckAndroid: true, // Lower other audio when playing
        playThroughEarpieceAndroid: false,
      });
    } catch (err) {
      console.error('Failed to configure audio:', err);
    }
  }

  async function cleanupSound() {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (err) {
        console.error('Error cleaning up sound:', err);
      }
      setSound(null);
      setIsPlaying(false);
    }
  }

  async function loadAndPlayAudio() {
    setIsLoading(true);
    setError(null);
    
    // Cleanup existing sound
    await cleanupSound();

    try {
      const audioUrl = `${AUDIO_BASE_URL}/${ayahNumber}.mp3`;
      
      console.log(`Loading audio: Surah ${surahNumber}, Ayah ${ayahInSurah} (${audioUrl})`);
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setIsPlaying(true);
    } catch (err) {
      console.error('Failed to load audio:', err);
      setError('فشل تحميل الصوت');
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }

  function onPlaybackStatusUpdate(status: any) {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      
      // Call onFinish when playback completes
      if (status.didJustFinish && !status.isLooping) {
        setIsPlaying(false);
        if (onFinish) {
          onFinish();
        }
      }
    } else if (status.error) {
      console.error('Playback error:', status.error);
      setError('خطأ في التشغيل');
      setIsPlaying(false);
    }
  }

  async function handlePlayPause() {
    if (isLoading) return;

    try {
      if (!sound) {
        // No sound loaded, load and play
        await loadAndPlayAudio();
      } else if (isPlaying) {
        // Pause current playback
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        // Resume playback
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Error during playback:', err);
      setError('خطأ في التشغيل');
    }
  }

  async function handleStop() {
    await cleanupSound();
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isPlaying && styles.buttonActive]}
        onPress={handlePlayPause}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#3b82f6" />
        ) : (
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={20}
            color={isPlaying ? '#3b82f6' : DarkTheme.textPrimary}
          />
        )}
      </TouchableOpacity>
      
      {isPlaying && (
        <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
          <Ionicons name="stop" size={16} color={DarkTheme.textSecondary} />
        </TouchableOpacity>
      )}

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  stopButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: DarkTheme.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  errorText: {
    fontSize: 10,
    color: '#ef4444',
    marginLeft: Spacing.xs,
  },
});
