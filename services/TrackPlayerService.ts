/**
 * Track Player Service
 * Handles background audio playback for Quran recitation using react-native-track-player.
 * Runs as a native foreground service on Android and integrates with iOS Control Center.
 *
 * Gracefully falls back to no-op when the native module is unavailable (e.g. Expo Go).
 * The Metro shim (shims/TrackPlayerModule.js) prevents crashes at module evaluation.
 */

import { useEffect, useState } from 'react';
import { NativeModules } from 'react-native';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  RepeatMode,
  State,
} from 'react-native-track-player';

// Detect if the real native module exists (not the Proxy shim)
const _nativeAvailable = !!NativeModules.TrackPlayerModule;

/** Whether react-native-track-player is usable on this runtime. */
export const isTrackPlayerAvailable = _nativeAvailable;

if (!_nativeAvailable) {
  console.warn('[TrackPlayer] Native module not available – background audio disabled (Expo Go).');
}

// ------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------
let isSetup = false;

export async function setupTrackPlayer(): Promise<boolean> {
  if (!_nativeAvailable) return false;
  if (isSetup) return true;

  try {
    await TrackPlayer.setupPlayer({
      minBuffer: 30,
      maxBuffer: 120,
      playBuffer: 5,
      backBuffer: 10,
    });

    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
    });

    await TrackPlayer.setRepeatMode(RepeatMode.Off);

    isSetup = true;
    return true;
  } catch (error) {
    console.error('[TrackPlayer] Setup failed:', error);
    return false;
  }
}

// ------------------------------------------------------------------
// Queue helpers
// ------------------------------------------------------------------
export function buildSurahQueue(
  surahNumber: number,
  surahName: string,
  ayahs: { numberInSurah: number; audioUrl?: string; arabicText: string }[]
) {
  return ayahs
    .filter((a) => !!a.audioUrl)
    .map((ayah) => ({
      id: `${surahNumber}-${ayah.numberInSurah}`,
      url: ayah.audioUrl!,
      title: `Ayah ${ayah.numberInSurah}`,
      artist: 'Mishary Alafasy',
      album: surahName,
      surahNumber,
      ayahNumber: ayah.numberInSurah,
    }));
}

// ------------------------------------------------------------------
// Playback controls
// ------------------------------------------------------------------
export async function playSurah(
  surahNumber: number,
  surahName: string,
  ayahs: { numberInSurah: number; audioUrl?: string; arabicText: string }[],
  startFromAyah: number = 1
): Promise<void> {
  if (!_nativeAvailable) return;
  const ready = await setupTrackPlayer();
  if (!ready) return;

  const queue = buildSurahQueue(surahNumber, surahName, ayahs);
  if (queue.length === 0) return;

  await TrackPlayer.reset();
  await TrackPlayer.add(queue);

  const startIndex = Math.max(0, startFromAyah - 1);
  if (startIndex > 0 && startIndex < queue.length) {
    await TrackPlayer.skip(startIndex);
  }

  await TrackPlayer.play();
}

export async function playAyah(
  surahNumber: number,
  surahName: string,
  ayahNumber: number,
  audioUrl: string
): Promise<void> {
  if (!_nativeAvailable) return;
  const ready = await setupTrackPlayer();
  if (!ready) return;

  await TrackPlayer.reset();
  await TrackPlayer.add({
    id: `${surahNumber}-${ayahNumber}`,
    url: audioUrl,
    title: `Ayah ${ayahNumber}`,
    artist: 'Mishary Alafasy',
    album: surahName,
    surahNumber,
    ayahNumber,
  });

  await TrackPlayer.play();
}

export async function stopPlayback(): Promise<void> {
  if (!_nativeAvailable || !isSetup) return;
  try {
    await TrackPlayer.reset();
  } catch {
    // Player may already be destroyed
  }
}

export async function togglePlayback(): Promise<void> {
  if (!_nativeAvailable || !isSetup) return;
  const playbackState = await TrackPlayer.getPlaybackState();
  if (playbackState.state === State.Playing) {
    await TrackPlayer.pause();
  } else {
    await TrackPlayer.play();
  }
}

// ------------------------------------------------------------------
// Safe React hooks (no-op when native module is absent)
// ------------------------------------------------------------------

/** Returns the currently active track, or undefined. */
export function useActiveTrackSafe() {
  const [track, setTrack] = useState<any>(undefined);

  useEffect(() => {
    if (!_nativeAvailable) return;
    TrackPlayer.getActiveTrack().then(setTrack).catch(() => {});
    const sub = TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (e: any) => {
      setTrack(e.track ?? undefined);
    });
    return () => sub.remove();
  }, []);

  return track;
}

/** Returns a simplified playback state string: 'playing' | 'buffering' | 'idle'. */
export function usePlaybackStateSafe(): 'playing' | 'buffering' | 'idle' {
  const [state, setState] = useState<'playing' | 'buffering' | 'idle'>('idle');

  useEffect(() => {
    if (!_nativeAvailable) return;
    const mapState = (s: any) => {
      if (s === State.Playing) return 'playing' as const;
      if (s === State.Buffering || s === State.Loading) return 'buffering' as const;
      return 'idle' as const;
    };
    TrackPlayer.getPlaybackState().then((s) => setState(mapState(s.state))).catch(() => {});
    const sub = TrackPlayer.addEventListener(Event.PlaybackState, (e: any) => {
      setState(mapState(e.state));
    });
    return () => sub.remove();
  }, []);

  return state;
}

/** Subscribe to PlaybackQueueEnded. Returns cleanup function. */
export function onQueueEnded(callback: () => void): (() => void) {
  if (!_nativeAvailable) return () => {};
  const sub = TrackPlayer.addEventListener(Event.PlaybackQueueEnded, callback);
  return () => sub.remove();
}

// ------------------------------------------------------------------
// Playback Service (lock screen / notification controls)
// ------------------------------------------------------------------
export async function PlaybackService() {
  if (!_nativeAvailable) return;
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
}

// ------------------------------------------------------------------
// Registration helper (call at module level in _layout.tsx)
// ------------------------------------------------------------------
export function registerPlaybackService() {
  if (!_nativeAvailable) return;
  try {
    TrackPlayer.registerPlaybackService(() => PlaybackService);
  } catch (e) {
    console.warn('[TrackPlayer] Failed to register playback service:', e);
  }
}
