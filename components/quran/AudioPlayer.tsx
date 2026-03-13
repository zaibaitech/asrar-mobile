/**
 * Quran Audio Player Component
 * Uses expo-av for audio playback.
 * (react-native-track-player removed due to New Architecture incompatibility)
 */

import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

interface AudioPlayerProps {
  audioUrl: string;
  ayahNumber: number;
  autoPlay?: boolean;
  onPlaybackStatusUpdate?: (isPlaying: boolean) => void;
  onFinished?: () => void;
  onPress?: () => void;
  surahName?: string;
}

export function AudioPlayer({
  audioUrl,
  ayahNumber,
  autoPlay = false,
  onPlaybackStatusUpdate,
  onFinished,
  onPress,
  surahName = 'Quran',
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Configure audio mode on mount
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    return () => {
      // Cleanup sound on unmount
      sound?.unloadAsync().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (autoPlay && audioUrl) {
      playAudio();
    } else if (!autoPlay && isPlaying) {
      stopAudio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, audioUrl]);

  const playAudio = async () => {
    if (onPress) {
      onPress();
    }

    try {
      setError(null);
      setIsLoading(true);

      // If paused, resume
      if (sound && !isPlaying) {
        await sound.playAsync();
        setIsPlaying(true);
        onPlaybackStatusUpdate?.(true);
        setIsLoading(false);
        return;
      }

      // Already playing
      if (isPlaying) {
        setIsLoading(false);
        return;
      }

      // Create new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
            onPlaybackStatusUpdate?.(false);
            onFinished?.();
            newSound.unloadAsync().catch(() => {});
            setSound(null);
          }
        }
      );

      setSound(newSound);
      setIsPlaying(true);
      onPlaybackStatusUpdate?.(true);
      setIsLoading(false);
    } catch (err) {
      console.error('[AudioPlayer] Playback error:', err);
      setError('Failed to play audio');
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const stopAudio = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }
      setIsPlaying(false);
      onPlaybackStatusUpdate?.(false);
    } catch (err) {
      console.error('[AudioPlayer] Stop error:', err);
    }
  };

  const handlePress = async () => {
    if (isPlaying) {
      await stopAudio();
    } else {
      await playAudio();
    }
  };

  if (error) {
    return (
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Ionicons name="refresh" size={20} color="#ef4444" />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#6366f1" />
      ) : (
        <Ionicons
          name={isPlaying ? 'pause-circle' : 'play-circle'}
          size={32}
          color="#6366f1"
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
});
