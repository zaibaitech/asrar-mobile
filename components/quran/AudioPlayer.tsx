/**
 * Quran Audio Player Component
 * Simple, elegant audio player for Ayah recitations
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
  onFinished?: () => void; // Called when audio finishes playing
  onPress?: () => void; // Called when user taps the button
}

export function AudioPlayer({ audioUrl, ayahNumber, autoPlay = false, onPlaybackStatusUpdate, onFinished, onPress }: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Configure audio mode for background playback (only once globally)
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true, // Allow background playback
      shouldDuckAndroid: true,
      interruptionModeIOS: 2, // Allow mixing with others but duck them
      interruptionModeAndroid: 2, // Continue playing during notifications
    });
  }, []);

  useEffect(() => {
    // Auto play if requested
    if (autoPlay && audioUrl) {
      playAudio();
    }
    // Stop playing if autoPlay becomes false (another ayah started playing)
    else if (!autoPlay && isPlaying) {
      stopAudio();
    }
  }, [autoPlay, audioUrl]);

  const playAudio = async () => {
    try {
      setError(null);

      // If already have a sound object and it's paused, resume it
      if (sound && !isPlaying) {
        setIsLoading(true);
        await sound.playAsync();
        setIsPlaying(true);
        onPlaybackStatusUpdate?.(true);
        setIsLoading(false);
        return;
      }

      // If already playing, do nothing (parent controls stop via autoPlay prop)
      if (isPlaying) {
        return;
      }

      // Show loading indicator while downloading/buffering audio from CDN
      setIsLoading(true);
      
      // Create and play new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
            onPlaybackStatusUpdate?.(false);
            // Call onFinished callback for continuous playback
            onFinished?.();
            // Unload after playback completes
            newSound.unloadAsync();
            setSound(null);
          }
        }
      );

      setSound(newSound);
      setIsPlaying(true);
      onPlaybackStatusUpdate?.(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Audio playback error:', err);
      setError('Failed to play audio');
      setIsLoading(false);
      setIsPlaying(false);
      onPlaybackStatusUpdate?.(false);
    }
  };

  const stopAudio = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
        onPlaybackStatusUpdate?.(false);
      }
    } catch (err) {
      console.error('Error stopping audio:', err);
    }
  };

  if (!audioUrl) {
    return null;
  }

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => {
        // Notify parent first
        onPress?.();
        // Then handle play/pause
        playAudio();
      }}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#3b82f6" />
      ) : (
        <Ionicons 
          name={isPlaying ? 'pause-circle' : 'play-circle'} 
          size={32} 
          color={error ? '#ef4444' : '#3b82f6'} 
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
    minHeight: 48,
  },
});
