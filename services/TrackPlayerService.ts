/**
 * Track Player Service
 * react-native-track-player has been removed due to New Architecture
 * (TurboModule) incompatibility on React Native 0.81 (crash in
 * TurboModuleInteropUtils.getMethodDescriptorsFromModule).
 *
 * All exports are no-ops. Audio playback uses expo-av instead.
 */

import { useEffect, useState } from 'react';

/** react-native-track-player is not available — always false. */
export const isTrackPlayerAvailable = false;

// ------------------------------------------------------------------
// Setup (no-op)
// ------------------------------------------------------------------
export async function setupTrackPlayer(): Promise<boolean> {
  return false;
}

// ------------------------------------------------------------------
// Queue helpers (no-op)
// ------------------------------------------------------------------
export function buildSurahQueue(
  _surahNumber: number,
  _surahName: string,
  _ayahs: { numberInSurah: number; audioUrl?: string; arabicText: string }[]
) {
  return [];
}

// ------------------------------------------------------------------
// Playback controls (no-op)
// ------------------------------------------------------------------
export async function playSurah(
  _surahNumber: number,
  _surahName: string,
  _ayahs: { numberInSurah: number; audioUrl?: string; arabicText: string }[],
  _startFromAyah: number = 1
): Promise<void> {}

export async function playAyah(
  _surahNumber: number,
  _surahName: string,
  _ayahNumber: number,
  _audioUrl: string
): Promise<void> {}

export async function stopPlayback(): Promise<void> {}

export async function togglePlayback(): Promise<void> {}

// ------------------------------------------------------------------
// Safe React hooks (always return idle/undefined since no native module)
// ------------------------------------------------------------------

/** Returns the currently active track, or undefined. */
export function useActiveTrackSafe() {
  const [track] = useState<undefined>(undefined);
  return track;
}

/** Returns a simplified playback state string: always 'idle' without TrackPlayer. */
export function usePlaybackStateSafe(): 'playing' | 'buffering' | 'idle' {
  const [state] = useState<'playing' | 'buffering' | 'idle'>('idle');
  useEffect(() => {}, []);
  return state;
}

/** No-op subscription. */
export function onQueueEnded(_callback: () => void): (() => void) {
  return () => {};
}

// ------------------------------------------------------------------
// Playback Service (no-op)
// ------------------------------------------------------------------
export async function PlaybackService() {}

// ------------------------------------------------------------------
// Registration helper (no-op)
// ------------------------------------------------------------------
export function registerPlaybackService() {}
