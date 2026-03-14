/**
 * Surah Audio Controller Hook
 * Manages full surah audio playback with ayah-level seek control
 * Industry-standard approach: Load once, seek to ayahs
 */

import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { getFullSurahAudioUrl, getSurahAudioTiming } from '@/data/quran-audio-timings';

export interface SurahAudioState {
  isLoading: boolean;
  isPlaying: boolean;
  currentAyah: number | null;
  error: string | null;
  duration: number;
  position: number;
}

export interface SurahAudioControls {
  playAyah: (ayahNumber: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  toggleContinuous: () => void;
  isContinuous: boolean;
}

export function useSurahAudio(surahNumber: number, numberOfAyahs: number) {
  const [state, setState] = useState<SurahAudioState>({
    isLoading: false,
    isPlaying: false,
    currentAyah: null,
    error: null,
    duration: 0,
    position: 0,
  });

  const [isContinuous, setIsContinuous] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const timingData = getSurahAudioTiming(surahNumber);
  const currentSourceIndex = useRef(0);
  const didJustFinishRef = useRef(false);
  const loadedSurahRef = useRef<number | null>(null);

  // Configure audio mode on mount and cleanup on unmount
  useEffect(() => {
    configureAudio();
    return () => {
      console.log('[SurahAudio] Component unmounting, cleaning up...');
      cleanup();
    };
  }, []);

  // Cleanup and reload when surah number changes
  useEffect(() => {
    // If audio is loaded for a different surah, clean up
    if (loadedSurahRef.current !== null && loadedSurahRef.current !== surahNumber) {
      console.log(`[SurahAudio] Surah changed from ${loadedSurahRef.current} to ${surahNumber}, cleaning up...`);
      cleanup();
      setState({
        isLoading: false,
        isPlaying: false,
        currentAyah: null,
        error: null,
        duration: 0,
        position: 0,
      });
      loadedSurahRef.current = null;
    }
  }, [surahNumber]);

  // Auto-advance to next ayah if continuous playback is enabled
  useEffect(() => {
    if (didJustFinishRef.current && state.currentAyah && isContinuous) {
      didJustFinishRef.current = false;
      
      // Current ayah finished, play next
      const nextAyah = state.currentAyah + 1;
      if (nextAyah <= numberOfAyahs) {
        console.log(`[SurahAudio] Auto-advancing to ayah ${nextAyah}`);
        playAyah(nextAyah);
      } else {
        // End of surah
        console.log('[SurahAudio] Reached end of surah');
        setState(prev => ({ ...prev, currentAyah: null, isPlaying: false }));
      }
    }
  }, [didJustFinishRef.current, state.currentAyah, isContinuous, numberOfAyahs]);

  async function configureAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (err) {
      console.error('[SurahAudio] Failed to configure audio:', err);
    }
  }

  async function cleanup() {
    if (soundRef.current) {
      try {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        }
      } catch (err) {
        console.log('[SurahAudio] Cleanup (non-critical):', err);
      }
      soundRef.current = null;
    }
    loadedSurahRef.current = null;
  }

  async function loadSurahAudio(): Promise<boolean> {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    // Try loading from different sources
    for (let i = 0; i < 2; i++) {
      try {
        const audioUrl = getFullSurahAudioUrl(surahNumber, i);
        console.log(`[SurahAudio] Loading surah ${surahNumber} from source ${i + 1}: ${audioUrl}`);

        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: false, progressUpdateIntervalMillis: 500 },
          onPlaybackStatusUpdate
        );

        soundRef.current = sound;
        currentSourceIndex.current = i;
        loadedSurahRef.current = surahNumber;
        
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            duration: status.durationMillis ? status.durationMillis / 1000 : 0,
          }));
          console.log(`[SurahAudio] Success: Loaded surah ${surahNumber} (duration: ${status.durationMillis}ms) from source ${i + 1}`);
          return true;
        }
      } catch (err) {
        console.error(`[SurahAudio] Failed source ${i + 1} for surah ${surahNumber}:`, err);
        await cleanup();
        
        // Continue to next source
      }
    }

    // All sources failed
    console.error(`[SurahAudio] All sources failed for surah ${surahNumber}`);
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: 'Cannot load audio',
    }));
    return false;
  }

  function onPlaybackStatusUpdate(status: any) {
    if (status.isLoaded) {
      setState(prev => ({
        ...prev,
        isPlaying: status.isPlaying,
        position: status.positionMillis ? status.positionMillis / 1000 : 0,
      }));

      // Update current ayah based on position if timing data is available
      if (timingData && status.positionMillis) {
        const positionSeconds = status.positionMillis / 1000;
        let currentAyahNumber = 1;
        
        // Find which ayah we're currently playing
        for (let i = numberOfAyahs; i >= 1; i--) {
          const ayahStartTime = timingData.ayahTimings[i];
          if (ayahStartTime !== undefined && positionSeconds >= ayahStartTime) {
            currentAyahNumber = i;
            break;
          }
        }

        setState(prev => {
          if (prev.currentAyah !== currentAyahNumber) {
            return { ...prev, currentAyah: currentAyahNumber };
          }
          return prev;
        });
      }

      // Handle playback completion
      if (status.didJustFinish) {
        console.log('[SurahAudio] Playback finished');
        didJustFinishRef.current = true;
        setState(prev => ({ ...prev, isPlaying: false }));
      }
    } else if (status.error) {
      console.error('[SurahAudio] Playback error:', status.error);
      setState(prev => ({ ...prev, error: 'خطأ في التشغيل', isPlaying: false }));
    }
  }

  async function playAyah(ayahNumber: number): Promise<void> {
    console.log(`[SurahAudio] playAyah called for ayah ${ayahNumber}`);
    
    // Reset finish flag
    didJustFinishRef.current = false;
    
    // Load surah audio if not already loaded
    if (!soundRef.current || loadedSurahRef.current !== surahNumber) {
      console.log(`[SurahAudio] Audio not loaded for surah ${surahNumber}, loading now...`);
      const loaded = await loadSurahAudio();
      if (!loaded) {
        console.error(`[SurahAudio] Failed to load audio for surah ${surahNumber}`);
        return;
      }
    }

    try {
      const sound = soundRef.current!;
      
      // Seek to ayah position if timing data is available
      if (timingData && timingData.ayahTimings[ayahNumber] !== undefined) {
        const startTimeMs = timingData.ayahTimings[ayahNumber] * 1000;
        await sound.setPositionAsync(startTimeMs);
        console.log(`[SurahAudio] Seeking to ayah ${ayahNumber} at ${startTimeMs}ms`);
      } else {
        // No timing data - play from current position or beginning
        console.log(`[SurahAudio] No timing data for surah ${surahNumber}, playing full audio`);
        if (ayahNumber === 1) {
          await sound.setPositionAsync(0);
          console.log(`[SurahAudio] Starting from beginning (ayah 1)`);
        }
      }

      await sound.playAsync();
      setState(prev => ({ ...prev, currentAyah: ayahNumber, isPlaying: true, error: null }));
      console.log(`[SurahAudio] Started playback for ayah ${ayahNumber}`);
    } catch (err) {
      console.error('[SurahAudio] Failed to play ayah:', err);
      setState(prev => ({ ...prev, error: 'Playback error', isPlaying: false }));
    }
  }

  async function pause(): Promise<void> {
    if (soundRef.current && loadedSurahRef.current === surahNumber) {
      try {
        await soundRef.current.pauseAsync();
        setState(prev => ({ ...prev, isPlaying: false }));
        console.log('[SurahAudio] Paused playback');
      } catch (err) {
        console.error('[SurahAudio] Pause error:', err);
      }
    }
  }

  async function resume(): Promise<void> {
    if (soundRef.current && loadedSurahRef.current === surahNumber) {
      try {
        await soundRef.current.playAsync();
        setState(prev => ({ ...prev, isPlaying: true }));
        console.log('[SurahAudio] Resumed playback');
      } catch (err) {
        console.error('[SurahAudio] Resume error:', err);
      }
    }
  }

  async function stop(): Promise<void> {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.setPositionAsync(0);
        setState(prev => ({ ...prev, isPlaying: false, currentAyah: null, position: 0 }));
        console.log('[SurahAudio] Stopped playback');
      } catch (err) {
        console.error('[SurahAudio] Stop error:', err);
      }
    }
  }

  function toggleContinuous(): void {
    setIsContinuous(prev => !prev);
  }

  const controls: SurahAudioControls = {
    playAyah,
    pause,
    resume,
    stop,
    toggleContinuous,
    isContinuous,
  };

  return { state, controls };
}
