/**
 * Mini Player Component
 * Persistent audio player controls that appear at the bottom of the screen
 * Shows current track info and playback controls
 */

import { DarkTheme } from '@/constants/DarkTheme';
import { isTrackPlayerAvailable } from '@/services/TrackPlayerService';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import TrackPlayer, { Event, State, Track } from 'react-native-track-player';

const ACCENT_COLOR = '#6366f1'; // Purple/indigo accent

export function MiniPlayer() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isTrackPlayerAvailable) {
      return;
    }

    // Load current track on mount
    const loadTrack = async () => {
      try {
        const track = await TrackPlayer.getActiveTrack();
        setCurrentTrack(track || null);
        
        const state = await TrackPlayer.getPlaybackState();
        setIsPlaying(state.state === State.Playing);
        setIsLoading(state.state === State.Buffering || state.state === State.Loading);
      } catch (error) {
        console.error('Failed to load track:', error);
      }
    };

    loadTrack();

    // Listen to playback state changes
    const stateListener = TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
      setIsPlaying(event.state === State.Playing);
      setIsLoading(event.state === State.Buffering || event.state === State.Loading);
    });

    // Listen to track changes
    const trackListener = TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
      setCurrentTrack(event.track || null);
    });

    // Listen to queue end
    const queueListener = TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
      setCurrentTrack(null);
      setIsPlaying(false);
    });

    return () => {
      stateListener.remove();
      trackListener.remove();
      queueListener.remove();
    };
  }, []);

  const handlePlayPause = async () => {
    if (!isTrackPlayerAvailable) {
      return;
    }

    try {
      if (isPlaying) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    } catch (error) {
      console.error('Failed to toggle playback:', error);
    }
  };

  const handleStop = async () => {
    if (!isTrackPlayerAvailable) {
      return;
    }

    try {
      await TrackPlayer.stop();
      await TrackPlayer.reset();
      setCurrentTrack(null);
    } catch (error) {
      console.error('Failed to stop playback:', error);
    }
  };

  // Don't show if no track is loaded
  if (!currentTrack) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.trackInfo}>
        <Ionicons name="musical-notes" size={20} color={ACCENT_COLOR} />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          {currentTrack.artist && (
            <Text style={styles.artist} numberOfLines={1}>
              {currentTrack.artist}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.controls}>
        <Pressable
          onPress={handlePlayPause}
          style={styles.controlButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={ACCENT_COLOR} />
          ) : (
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={28}
              color={ACCENT_COLOR}
            />
          )}
        </Pressable>

        <Pressable onPress={handleStop} style={styles.controlButton}>
          <Ionicons name="stop" size={24} color={DarkTheme.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DarkTheme.cardBackground,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    color: DarkTheme.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  artist: {
    color: DarkTheme.textSecondary,
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
