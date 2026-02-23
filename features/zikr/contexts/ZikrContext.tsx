/**
 * Zikr Context
 * ============
 * React Context + useReducer for challenge state management.
 * Based on web app's RamadanChallengesProvider pattern.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useReducer
} from 'react';
import {
    calculateStreak,
    generateId,
    getToday,
    ISTIGHFAR_CONFIG,
    STORAGE_KEY
} from '../constants';
import type {
    Challenge,
    ChallengeConfig,
    ChallengeType,
    SessionTag,
    ZikrAction,
    ZikrState
} from '../types';

// ─── Initial State ───────────────────────────────────────────────────────────────

const initialState: ZikrState = {
  challenges: [],
  currentDate: getToday(),
  isHydrated: false,
};

// ─── Reducer ─────────────────────────────────────────────────────────────────────

function zikrReducer(state: ZikrState, action: ZikrAction): ZikrState {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        challenges: action.payload.challenges,
        currentDate: action.payload.currentDate,
        isHydrated: true,
      };

    case 'ADD_CHALLENGE':
      return {
        ...state,
        challenges: [...state.challenges, action.payload],
      };

    case 'REMOVE_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.filter(c => c.id !== action.payload.id),
      };

    case 'LOG_COUNT': {
      const { id, amount, session } = action.payload;
      const today = getToday();
      
      return {
        ...state,
        challenges: state.challenges.map(challenge => {
          if (challenge.id !== id) return challenge;
          
          const newStreak = calculateStreak(
            challenge.lastLoggedDate,
            challenge.streakDays,
            today
          );
          
          const newLog = {
            date: today,
            session,
            count: amount,
            timestamp: new Date().toISOString(),
          };
          
          return {
            ...challenge,
            todayProgress: challenge.todayProgress + amount,
            totalProgress: challenge.totalProgress + amount,
            streakDays: newStreak,
            lastLoggedDate: today,
            sessionLogs: [...challenge.sessionLogs, newLog],
          };
        }),
      };
    }

    case 'SET_TARGETS':
      return {
        ...state,
        challenges: state.challenges.map(challenge => {
          if (challenge.id !== action.payload.id) return challenge;
          return {
            ...challenge,
            dailyTarget: action.payload.dailyTarget,
            totalTarget: action.payload.totalTarget,
          };
        }),
      };

    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        challenges: state.challenges.map(challenge => {
          if (challenge.id !== action.payload.id) return challenge;
          return {
            ...challenge,
            isFavorite: !challenge.isFavorite,
          };
        }),
      };

    case 'RESET_TODAY': {
      const newDate = action.payload.currentDate;
      return {
        ...state,
        currentDate: newDate,
        challenges: state.challenges.map(challenge => {
          // Reset today's progress if it's a new day
          if (challenge.lastLoggedDate !== newDate) {
            return {
              ...challenge,
              todayProgress: 0,
              // Reset streak if more than 1 day gap
              streakDays: challenge.lastLoggedDate && 
                !isWithinOneDay(challenge.lastLoggedDate, newDate)
                  ? 0 
                  : challenge.streakDays,
            };
          }
          return challenge;
        }),
      };
    }

    default:
      return state;
  }
}

// Helper to check if dates are within one day
function isWithinOneDay(dateA: string, dateB: string): boolean {
  const a = new Date(dateA);
  const b = new Date(dateB);
  const diff = Math.abs(b.getTime() - a.getTime());
  const oneDay = 24 * 60 * 60 * 1000;
  return diff <= oneDay;
}

// ─── Context Type ────────────────────────────────────────────────────────────────

interface ZikrContextValue {
  state: ZikrState;
  
  // Actions
  addChallenge: (type: ChallengeType, config: ChallengeConfig) => void;
  removeChallenge: (id: string) => void;
  logCount: (id: string, amount: number, session: SessionTag) => void;
  setTargets: (id: string, dailyTarget: number, totalTarget: number) => void;
  toggleFavorite: (id: string) => void;
  
  // Computed
  getTotalTodayProgress: () => number;
  getTotalProgress: () => number;
  getChallengesByType: (type: ChallengeType) => Challenge[];
  getFavorites: () => Challenge[];
}

// ─── Context ─────────────────────────────────────────────────────────────────────

const ZikrContext = createContext<ZikrContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────────

interface ZikrProviderProps {
  children: ReactNode;
}

export function ZikrProvider({ children }: ZikrProviderProps) {
  const [state, dispatch] = useReducer(zikrReducer, initialState);

  // Hydrate from storage on mount
  useEffect(() => {
    const hydrate = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const currentDate = getToday();
        
        if (stored) {
          const challenges = JSON.parse(stored) as Challenge[];
          dispatch({ type: 'HYDRATE', payload: { challenges, currentDate } });
        } else {
          // First time user - create default Istighfār challenge
          const defaultChallenge = createChallengeFromConfig('ISTIGHFAR', ISTIGHFAR_CONFIG);
          dispatch({ type: 'HYDRATE', payload: { challenges: [defaultChallenge], currentDate } });
        }
      } catch (error) {
        console.error('Failed to hydrate zikr state:', error);
        dispatch({ type: 'HYDRATE', payload: { challenges: [], currentDate: getToday() } });
      }
    };
    
    hydrate();
  }, []);

  // Persist to storage when challenges change
  useEffect(() => {
    if (state.isHydrated) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.challenges)).catch(
        error => console.error('Failed to persist zikr state:', error)
      );
    }
  }, [state.challenges, state.isHydrated]);

  // Day reset polling (every 60 seconds)
  useEffect(() => {
    const checkDayReset = () => {
      const today = getToday();
      if (today !== state.currentDate) {
        dispatch({ type: 'RESET_TODAY', payload: { currentDate: today } });
      }
    };

    const interval = setInterval(checkDayReset, 60000);
    return () => clearInterval(interval);
  }, [state.currentDate]);

  // ─── Actions ─────────────────────────────────────────────────────────────────

  const addChallenge = useCallback((type: ChallengeType, config: ChallengeConfig) => {
    const challenge = createChallengeFromConfig(type, config);
    dispatch({ type: 'ADD_CHALLENGE', payload: challenge });
  }, []);

  const removeChallenge = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_CHALLENGE', payload: { id } });
  }, []);

  const logCount = useCallback((id: string, amount: number, session: SessionTag) => {
    dispatch({ type: 'LOG_COUNT', payload: { id, amount, session } });
  }, []);

  const setTargets = useCallback((id: string, dailyTarget: number, totalTarget: number) => {
    dispatch({ type: 'SET_TARGETS', payload: { id, dailyTarget, totalTarget } });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: { id } });
  }, []);

  // ─── Computed Values ─────────────────────────────────────────────────────────

  const getTotalTodayProgress = useCallback(() => {
    return state.challenges.reduce((sum, c) => sum + c.todayProgress, 0);
  }, [state.challenges]);

  const getTotalProgress = useCallback(() => {
    return state.challenges.reduce((sum, c) => sum + c.totalProgress, 0);
  }, [state.challenges]);

  const getChallengesByType = useCallback((type: ChallengeType) => {
    return state.challenges.filter(c => c.type === type);
  }, [state.challenges]);

  const getFavorites = useCallback(() => {
    return state.challenges.filter(c => c.isFavorite);
  }, [state.challenges]);

  // ─── Context Value ───────────────────────────────────────────────────────────

  const value: ZikrContextValue = {
    state,
    addChallenge,
    removeChallenge,
    logCount,
    setTargets,
    toggleFavorite,
    getTotalTodayProgress,
    getTotalProgress,
    getChallengesByType,
    getFavorites,
  };

  return (
    <ZikrContext.Provider value={value}>
      {children}
    </ZikrContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────────

export function useZikr() {
  const context = useContext(ZikrContext);
  if (!context) {
    throw new Error('useZikr must be used within a ZikrProvider');
  }
  return context;
}

// ─── Helper Function ─────────────────────────────────────────────────────────────

function createChallengeFromConfig(type: ChallengeType, config: ChallengeConfig): Challenge {
  return {
    id: generateId(),
    type,
    title: config.title,
    arabicText: config.arabicText,
    transliteration: config.transliteration,
    meaning: config.meaning,
    meaningFr: config.meaningFr,
    dailyTarget: config.dailyTarget,
    totalTarget: config.totalTarget,
    todayProgress: 0,
    totalProgress: 0,
    streakDays: 0,
    lastLoggedDate: null,
    quickAddPresets: config.quickAddPresets,
    sessionLogs: [],
    createdAt: new Date().toISOString(),
    isFavorite: false,
  };
}

export default ZikrProvider;
