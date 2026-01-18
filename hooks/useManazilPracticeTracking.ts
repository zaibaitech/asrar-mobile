import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as React from 'react';

const COMPLETED_KEY = '@asrar_manazil_completed_v1';
const FAVORITES_KEY = '@asrar_manazil_favorites_v1';
const ADVANCED_KEY = '@asrar_manazil_advanced_v1';
const DHIKR_PROGRESS_KEY = '@asrar_manazil_dhikr_progress_v1';

type TrackingState = {
  completed: Record<string, true>;
  favorites: Record<string, true>;
  advancedMode: boolean;
  dhikr: Record<string, { count: number; elapsedSeconds: number }>;
};

function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function keyFor(mansionIndex: number, itemId: string): string {
  return `${mansionIndex}:${itemId}`;
}

export function useManazilPracticeTracking(mansionIndex: number) {
  const [state, setState] = React.useState<TrackingState>({
    completed: {},
    favorites: {},
    advancedMode: false,
    dhikr: {},
  });
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const [completedRaw, favoritesRaw, advancedRaw, dhikrRaw] = await Promise.all([
        AsyncStorage.getItem(COMPLETED_KEY),
        AsyncStorage.getItem(FAVORITES_KEY),
        AsyncStorage.getItem(ADVANCED_KEY),
        AsyncStorage.getItem(DHIKR_PROGRESS_KEY),
      ]);

      if (cancelled) return;

      setState({
        completed: safeJsonParse(completedRaw, {} as Record<string, true>),
        favorites: safeJsonParse(favoritesRaw, {} as Record<string, true>),
        advancedMode: safeJsonParse(advancedRaw, false as boolean),
        dhikr: safeJsonParse(dhikrRaw, {} as Record<string, { count: number; elapsedSeconds: number }>),
      });
      setHydrated(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const isCompleted = React.useCallback(
    (itemId: string) => Boolean(state.completed[keyFor(mansionIndex, itemId)]),
    [state.completed, mansionIndex]
  );

  const isFavorite = React.useCallback(
    (itemId: string) => Boolean(state.favorites[keyFor(mansionIndex, itemId)]),
    [state.favorites, mansionIndex]
  );

  const toggleCompleted = React.useCallback(
    async (itemId: string) => {
      const k = keyFor(mansionIndex, itemId);
      const next = { ...state.completed };
      if (next[k]) delete next[k];
      else next[k] = true;
      setState((s) => ({ ...s, completed: next }));
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
      await AsyncStorage.setItem(COMPLETED_KEY, JSON.stringify(next));
    },
    [state.completed, mansionIndex]
  );

  const toggleFavorite = React.useCallback(
    async (itemId: string) => {
      const k = keyFor(mansionIndex, itemId);
      const next = { ...state.favorites };
      if (next[k]) delete next[k];
      else next[k] = true;
      setState((s) => ({ ...s, favorites: next }));
      try {
        await Haptics.selectionAsync();
      } catch {}
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    },
    [state.favorites, mansionIndex]
  );

  const setAdvancedMode = React.useCallback(
    async (enabled: boolean) => {
      setState((s) => ({ ...s, advancedMode: enabled }));
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
      await AsyncStorage.setItem(ADVANCED_KEY, JSON.stringify(enabled));
    },
    []
  );

  const getDhikrProgress = React.useCallback(
    (itemId: string) => {
      const v = state.dhikr[keyFor(mansionIndex, itemId)];
      return {
        count: typeof v?.count === 'number' ? v.count : 0,
        elapsedSeconds: typeof v?.elapsedSeconds === 'number' ? v.elapsedSeconds : 0,
      };
    },
    [state.dhikr, mansionIndex]
  );

  const setDhikrProgress = React.useCallback(
    async (itemId: string, next: { count: number; elapsedSeconds: number }) => {
      const k = keyFor(mansionIndex, itemId);
      const merged = {
        ...state.dhikr,
        [k]: {
          count: Math.max(0, Math.floor(next.count)),
          elapsedSeconds: Math.max(0, Math.floor(next.elapsedSeconds)),
        },
      };
      setState((s) => ({ ...s, dhikr: merged }));
      await AsyncStorage.setItem(DHIKR_PROGRESS_KEY, JSON.stringify(merged));
    },
    [state.dhikr, mansionIndex]
  );

  const progressFor = React.useCallback(
    (itemIds: string[]) => {
      const total = itemIds.length;
      if (total === 0) return { done: 0, total: 0 };
      let done = 0;
      for (const id of itemIds) {
        if (state.completed[keyFor(mansionIndex, id)]) done += 1;
      }
      return { done, total };
    },
    [state.completed, mansionIndex]
  );

  return {
    hydrated,
    advancedMode: state.advancedMode,
    setAdvancedMode,
    isCompleted,
    toggleCompleted,
    isFavorite,
    toggleFavorite,
    progressFor,
    getDhikrProgress,
    setDhikrProgress,
  };
}
