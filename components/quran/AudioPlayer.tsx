/**
 * Quran Audio Player Component
 * Simple, elegant audio player for Ayah recitations
 * Uses react-native-track-player for background audio support (production builds)
 * Falls back to expo-av for Expo Go compatibility
 */

import { isTrackPlayerAvailable, setupTrackPlayer } from '@/services/TrackPlayerService';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import TrackPlayer, { Event, State } from 'react-native-track-player';

interface AudioPlayerProps {
  audioUrl: string;
  ayahNumber: number;
  autoPlay?: boolean;
  onPlaybackStatusUpdate?: (isPlaying: boolean) => void;
  onFinished?: () => void; // Called when audio finishes playing
  onPress?: () => void; // Called when user taps the button
  surahName?: string; // Optional surah name for better UI
}

export function AudioPlayer({ 
  audioUrl, 
  ayahNumber, 
  autoPlay = false, 
  onPlaybackStatusUpdate, 
  onFinished, 
  onPress,
  surahName = 'Quran'
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  
  // For expo-av fallback (Expo Go)
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Track ID for this ayah
  const trackId = `ayah-${ayahNumber}-${audioUrl}`;

  // Configure audio mode on mount (for expo-av fallback)
  useEffect(() => {
    if (!isTrackPlayerAvailable) {
      Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false, // Limited in Expo Go
        shouldDuckAndroid: true,
      });
    }

    // Cleanup on unmount
    return () => {
      if (sound) {
        sound.unloadAsync().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    // Auto play if requested
    if (autoPlay && audioUrl) {
      playAudio();
    }
    // Stop playing if autoPlay becomes false (another ayah started playing)
    else if (!autoPlay && isPlaying && currentTrackId === trackId) {
      stopAudio();
    }
  }, [autoPlay, audioUrl]);

  useEffect(() => {
    if (!isTrackPlayerAvailable) {
      return;
    }

    // Listen for playback state changes
    const stateListener = TrackPlayer.addEventListener(Event.PlaybackState, async (event) => {
      const state = event.state;
      const active = await TrackPlayer.getActiveTrack();
      
      if (active?.id === trackId) {
        const playing = state === State.Playing;
        setIsPlaying(playing);
        onPlaybackStatusUpdate?.(playing);
        setIsLoading(state === State.Buffering || state === State.Loading);
      }
    });

    // Listen for track changes (when this ayah finishes)
    const trackListener = TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async (event) => {
      // If track changed away from this ayah, mark as not playing
      if (event.track?.id !== trackId && currentTrackId === trackId) {
        setIsPlaying(false);
        onPlaybackStatusUpdate?.(false);
      }
    });

    // Listen for queue end
    const queueListener = TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async () => {
      const active = await TrackPlayer.getActiveTrack();
      if (active?.id === trackId) {
        setIsPlaying(false);
        onPlaybackStatusUpdate?.(false);
        onFinished?.();
      }
    });

    return () => {
      stateListener.remove();
      trackListener.remove();
      queueListener.remove();
    };
  }, [trackId, currentTrackId]);

  const playAudio = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Use TrackPlayer if available (production builds)
      if (isTrackPlayerAvailable) {
        const ready = await setupTrackPlayer();
        if (!ready) {
          setError('Failed to initialize player');
          setIsLoading(false);
          return;
        }

        const state = await TrackPlayer.getPlaybackState();
        const activeTrack = await TrackPlayer.getActiveTrack();

        if (activeTrack?.id === trackId && state.state === State.Paused) {
          await TrackPlayer.play();
          setIsPlaying(true);
          onPlaybackStatusUpdate?.(true);
          setIsLoading(false);
          return;
        }

        if (activeTrack?.id === trackId && state.state === State.Playing) {
          setIsLoading(false);
          return;
        }

        await TrackPlayer.reset();
        await TrackPlayer.add({
          id: trackId,
          url: audioUrl,
          title: `Ayah ${ayahNumber}`,
          artist: 'Mishary Alafasy',
          album: surahName,
        });

        await TrackPlayer.play();
        setCurrentTrackId(trackId);
        setIsPlaying(true);
        onPlaybackStatusUpdate?.(true);
        setIsLoading(false);
      } else {
        // Fallback to expo-av for Expo Go
        if (sound && !isPlaying) {
          await sound.playAsync();
          setIsPlaying(true);
          onPlaybackStatusUpdate?.(true);
          setIsLoading(false);
          return;
        }

        if (isPlaying) {
          return;
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true },
          (status) => {
            if (status.isLoaded && status.didJustFinish) {
              setIsPlaying(false);
              onPlaybackStatusUpdate?.(false);
              onFinished?.();
              newSound.unloadAsync();
              setSound(null);
            }
          }
        );

        setSound(newSound);
        setIsPlaying(true);
        onPlaybackStatusUpdate?.(true);
        setIsLoading(false);
      }
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
      if (isTrackPlayerAvailable) {
        const activeTrack = await TrackPlayer.getActiveTrack();
        if (activeTrack?.id === trackId) {
          await TrackPlayer.stop();
          await TrackPlayer.reset();
          setIsPlaying(false);
          onPlaybackStatusUpdate?.(false);
          setCurrentTrackId(null);
        }
      } else {
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
          setSound(null);
          setIsPlaying(false);
          onPlaybackStatusUpdate?.(false);
        }
      }
    } catch (err) {
      console.error('Error stopping audio:', err);
    }
  };

  const handlePress = async () => {
    onPress?.();
    
    if (isPlaying) {
      if (isTrackPlayerAvailable) {
        const activeTrack = await TrackPlayer.getActiveTrack();
        if (activeTrack?.id === trackId) {
          await TrackPlayer.pause();
          setIsPlaying(false);
          onPlaybackStatusUpdate?.(false);
        }
      } else {
        if (sound) {
          await sound.pauseAsync();
          setIsPlaying(false);
          onPlaybackStatusUpdate?.(false);
        }
      }
    } else {
      await playAudio();
    }
  };

  if (!audioUrl) {
    return null;
  }

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
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
