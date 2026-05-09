/**
 * Surah Audio Controller Hook
 * Manages full surah audio playback with ayah-level seek control
 * Industry-standard approach: Load once, seek to ayahs
 * Falls back to individual ayah audio when timing data is unavailable
 */

import { DEFAULT_RECITER_ID, QuranReciter, getReciterById } from '@/constants/quranReciters';
import { getSurahAudioTiming } from '@/data/quran-audio-timings';
import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

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

export function useSurahAudio(surahNumber: number, numberOfAyahs: number, reciterId: string = DEFAULT_RECITER_ID) {
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
  const loadedReciterRef = useRef<string | null>(null);

  // Refs kept in sync with latest state/props to avoid stale closures in audio callbacks
  const isContinuousRef = useRef(false);
  const currentAyahRef = useRef<number | null>(null);
  const numberOfAyahsRef = useRef(numberOfAyahs);
  const playAyahRef = useRef<(n: number) => Promise<void>>(async () => {});
  const statusCallbackRef = useRef<(status: any) => void>(() => {});
  const reciterRef = useRef<QuranReciter>(getReciterById(reciterId));

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

  // Keep refs in sync with latest values so audio callbacks are never stale
  useEffect(() => { isContinuousRef.current = isContinuous; }, [isContinuous]);
  useEffect(() => { currentAyahRef.current = state.currentAyah; }, [state.currentAyah]);
  useEffect(() => { numberOfAyahsRef.current = numberOfAyahs; }, [numberOfAyahs]);

  // When reciter changes, update ref and unload current audio so next play uses new reciter
  useEffect(() => {
    reciterRef.current = getReciterById(reciterId);
    if (loadedSurahRef.current !== null || loadedReciterRef.current !== reciterId) {
      console.log(`[SurahAudio] Reciter changed to ${reciterId}, resetting audio`);
      cleanup();
      loadedReciterRef.current = null;
      setState(prev => ({ ...prev, isPlaying: false, currentAyah: null }));
    }
  }, [reciterId]);

  // AppState listener: recover if sound was unloaded while app was in background
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState !== 'active' || !soundRef.current) return;
      try {
        const status = await soundRef.current.getStatusAsync();
        if (!status.isLoaded && loadedSurahRef.current !== null) {
          console.log('[SurahAudio] Sound unloaded in background — resetting for reload on next play');
          soundRef.current = null;
          loadedSurahRef.current = null;
          setState(prev => ({ ...prev, isPlaying: false }));
        }
      } catch {
        soundRef.current = null;
        loadedSurahRef.current = null;
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  // Stable wrapper passed to createAsync — always delegates to the latest callback via ref
  const stableOnPlaybackStatusUpdate = useCallback((status: any) => {
    statusCallbackRef.current(status);
  }, []);

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

    // Try loading from reciter's configured sources
    const sources = reciterRef.current.fullSurahBaseUrls;
    for (let i = 0; i < sources.length; i++) {
      try {
        const audioUrl = `${sources[i]}/${String(surahNumber).padStart(3, '0')}.mp3`;
        console.log(`[SurahAudio] Loading surah ${surahNumber} from source ${i + 1}: ${audioUrl}`);

        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: false, progressUpdateIntervalMillis: 500 },
          stableOnPlaybackStatusUpdate
        );

        soundRef.current = sound;
        currentSourceIndex.current = i;
        loadedSurahRef.current = surahNumber;
        loadedReciterRef.current = reciterId;
        
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

  function handleAutoAdvance(): void {
    if (!isContinuousRef.current || currentAyahRef.current === null) return;
    const nextAyah = currentAyahRef.current + 1;
    if (nextAyah <= numberOfAyahsRef.current) {
      console.log(`[SurahAudio] Auto-advancing to ayah ${nextAyah}`);
      setTimeout(() => playAyahRef.current(nextAyah), 100);
    } else {
      console.log('[SurahAudio] Reached end of surah');
      setState(prev => ({ ...prev, currentAyah: null, isPlaying: false }));
    }
  }

  function updateAyahFromPosition(positionMillis: number): void {
    if (!timingData) return;
    const positionSeconds = positionMillis / 1000;
    let currentAyahNumber = 1;
    for (let i = numberOfAyahs; i >= 1; i--) {
      const ayahStartTime = timingData.ayahTimings[i];
      if (ayahStartTime !== undefined && positionSeconds >= ayahStartTime) {
        currentAyahNumber = i;
        break;
      }
    }
    setState(prev => prev.currentAyah === currentAyahNumber ? prev : { ...prev, currentAyah: currentAyahNumber });
  }

  function onPlaybackStatusUpdate(status: any) {
    if (status.isLoaded) {
      setState(prev => ({
        ...prev,
        isPlaying: status.isPlaying,
        position: status.positionMillis ? status.positionMillis / 1000 : 0,
      }));

      if (status.positionMillis) {
        updateAyahFromPosition(status.positionMillis);
      }

      // Handle playback completion — advance directly using refs to avoid stale closure
      if (status.didJustFinish) {
        console.log('[SurahAudio] Playback finished');
        didJustFinishRef.current = true;
        setState(prev => ({ ...prev, isPlaying: false }));
        handleAutoAdvance();
      }
    } else if (status.error) {
      console.error('[SurahAudio] Playback error:', status.error);
      setState(prev => ({ ...prev, error: 'خطأ في التشغيل', isPlaying: false }));
    } else {
      // Sound was unloaded without error (OS interrupted, e.g. background eviction)
      console.log('[SurahAudio] Sound unloaded by OS — resetting');
      soundRef.current = null;
      loadedSurahRef.current = null;
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }

  async function playAyah(ayahNumber: number): Promise<void> {
    console.log(`[SurahAudio] playAyah called for ayah ${ayahNumber}`);
    
    // Reset finish flag
    didJustFinishRef.current = false;
    
    // Check if timing data is available for this surah
    const hasTimingData = timingData?.ayahTimings[ayahNumber] !== undefined;
    
    if (hasTimingData) {
      // MODE 1: Use full surah audio with seek (preferred)
      console.log(`[SurahAudio] Using full surah audio with seek`);
      
      // Load surah audio if not already loaded
      if (!soundRef.current || loadedSurahRef.current !== surahNumber || loadedReciterRef.current !== reciterId) {
        console.log(`[SurahAudio] Audio not loaded for surah ${surahNumber}, loading now...`);
        const loaded = await loadSurahAudio();
        if (!loaded) {
          console.error(`[SurahAudio] Failed to load audio for surah ${surahNumber}`);
          return;
        }
      }

      try {
        const sound = soundRef.current!;
        const startTimeMs = timingData.ayahTimings[ayahNumber] * 1000;
        await sound.setPositionAsync(startTimeMs);
        await sound.playAsync();
        setState(prev => ({ ...prev, currentAyah: ayahNumber, isPlaying: true, error: null }));
        console.log(`[SurahAudio] Seeking to ayah ${ayahNumber} at ${startTimeMs}ms`);
      } catch (err) {
        console.error('[SurahAudio] Failed to play ayah:', err);
        setState(prev => ({ ...prev, error: 'Playback error', isPlaying: false }));
      }
    } else {
      // MODE 2: Use individual ayah audio (fallback)
      console.log(`[SurahAudio] No timing data, using individual ayah audio`);
      await playIndividualAyah(ayahNumber);
    }
  }

  async function playIndividualAyah(ayahNumber: number): Promise<void> {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    // Cleanup existing sound
    await cleanup();

    console.log(`[SurahAudio] Loading individual ayah ${ayahNumber} for surah ${surahNumber}`);

    // Try reciter's per-ayah CDN first, then generic fallback
    const slug = reciterRef.current.everyayahSlug;
    const filename = `${String(surahNumber).padStart(3, '0')}${String(ayahNumber).padStart(3, '0')}.mp3`;
    const individualSources = [
      `https://everyayah.com/data/${slug}/${filename}`,
      `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${filename}`, // universal fallback
    ];
    for (let i = 0; i < individualSources.length; i++) {
      try {
        const audioUrl = individualSources[i];
        console.log(`[SurahAudio] Attempt ${i + 1}: ${audioUrl}`);
        loadedReciterRef.current = reciterId;

        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true },
          stableOnPlaybackStatusUpdate
        );

        soundRef.current = sound;
        currentSourceIndex.current = i;
        loadedSurahRef.current = surahNumber;
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          currentAyah: ayahNumber,
          isPlaying: true,
          error: null,
        }));
        console.log(`[SurahAudio] Success: Loaded individual ayah from source ${i + 1}`);
        return;
      } catch (err) {
        console.error(`[SurahAudio] Failed source ${i + 1}:`, err);
        if (soundRef.current) {
          try {
            const status = await soundRef.current.getStatusAsync();
            if (status.isLoaded) {
              await soundRef.current.unloadAsync();
            }
          } catch (cleanupErr) {
            console.log('[SurahAudio] Cleanup error (non-critical):', cleanupErr);
          }
          soundRef.current = null;
        }
      }
    }

    // All sources failed
    console.error(`[SurahAudio] All sources failed for ayah ${ayahNumber}`);
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: 'Cannot load audio',
      isPlaying: false,
    }));
  }

  async function pause(): Promise<void> {
    if (soundRef.current) {
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
    if (soundRef.current) {
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

  // Always reflect latest versions before render returns
  statusCallbackRef.current = onPlaybackStatusUpdate;
  playAyahRef.current = playAyah;

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
