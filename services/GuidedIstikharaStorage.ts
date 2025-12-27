/**
 * Guided Istikhārah Storage Service
 * ==================================
 * Phase 5: Local storage for istikhārah sessions and reflections
 */

import {
    DirectionFeeling,
    EaseLevel,
    EmotionalState,
    GuidedIstikharaSession,
    IstikharaPatternSummary,
    IstikharaReflectionEntry,
} from '@/types/guided-istikhara';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEY_SESSIONS = 'guided_istikhara_sessions_v1';
const MAX_ACTIVE_SESSIONS = 5;

/**
 * Load all istikhārah sessions
 */
export async function loadIstikharaSessions(): Promise<GuidedIstikharaSession[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY_SESSIONS);
    if (!data) return [];
    
    const sessions: GuidedIstikharaSession[] = JSON.parse(data);
    
    // Sort by created date (most recent first)
    return sessions.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Failed to load istikhara sessions:', error);
    return [];
  }
}

/**
 * Save a new istikhārah session
 */
export async function saveIstikharaSession(
  session: GuidedIstikharaSession
): Promise<void> {
  try {
    const sessions = await loadIstikharaSessions();
    
    // Add new session
    const updatedSessions = [session, ...sessions];
    
    // Keep only max active sessions (remove oldest)
    const prunedSessions = updatedSessions.slice(0, MAX_ACTIVE_SESSIONS);
    
    await AsyncStorage.setItem(
      STORAGE_KEY_SESSIONS,
      JSON.stringify(prunedSessions)
    );
  } catch (error) {
    console.error('Failed to save istikhara session:', error);
    throw error;
  }
}

/**
 * Update an existing session
 */
export async function updateIstikharaSession(
  sessionId: string,
  updates: Partial<GuidedIstikharaSession>
): Promise<void> {
  try {
    const sessions = await loadIstikharaSessions();
    
    const updatedSessions = sessions.map((session) =>
      session.id === sessionId ? { ...session, ...updates } : session
    );
    
    await AsyncStorage.setItem(
      STORAGE_KEY_SESSIONS,
      JSON.stringify(updatedSessions)
    );
  } catch (error) {
    console.error('Failed to update istikhara session:', error);
    throw error;
  }
}

/**
 * Get a specific session by ID
 */
export async function getIstikharaSession(
  sessionId: string
): Promise<GuidedIstikharaSession | null> {
  try {
    const sessions = await loadIstikharaSessions();
    return sessions.find((s) => s.id === sessionId) || null;
  } catch (error) {
    console.error('Failed to get istikhara session:', error);
    return null;
  }
}

/**
 * Add a reflection entry to a session
 */
export async function addReflectionEntry(
  sessionId: string,
  entry: IstikharaReflectionEntry
): Promise<void> {
  try {
    const session = await getIstikharaSession(sessionId);
    if (!session) throw new Error('Session not found');
    
    // Check if entry for this date already exists
    const existingIndex = session.reflections.findIndex(
      (r) => r.date === entry.date
    );
    
    let updatedReflections: IstikharaReflectionEntry[];
    
    if (existingIndex >= 0) {
      // Update existing entry
      updatedReflections = [...session.reflections];
      updatedReflections[existingIndex] = entry;
    } else {
      // Add new entry
      updatedReflections = [...session.reflections, entry];
    }
    
    await updateIstikharaSession(sessionId, {
      reflections: updatedReflections,
    });
  } catch (error) {
    console.error('Failed to add reflection entry:', error);
    throw error;
  }
}

/**
 * Close an istikhārah session
 */
export async function closeIstikharaSession(sessionId: string): Promise<void> {
  try {
    await updateIstikharaSession(sessionId, {
      closedAt: Date.now(),
    });
  } catch (error) {
    console.error('Failed to close istikhara session:', error);
    throw error;
  }
}

/**
 * Delete a session
 */
export async function deleteIstikharaSession(sessionId: string): Promise<void> {
  try {
    const sessions = await loadIstikharaSessions();
    const filteredSessions = sessions.filter((s) => s.id !== sessionId);
    
    await AsyncStorage.setItem(
      STORAGE_KEY_SESSIONS,
      JSON.stringify(filteredSessions)
    );
  } catch (error) {
    console.error('Failed to delete istikhara session:', error);
    throw error;
  }
}

/**
 * Get active (not closed) sessions
 */
export async function getActiveSessions(): Promise<GuidedIstikharaSession[]> {
  try {
    const sessions = await loadIstikharaSessions();
    return sessions.filter((s) => !s.closedAt);
  } catch (error) {
    console.error('Failed to get active sessions:', error);
    return [];
  }
}

/**
 * Calculate pattern summary from session (observational only)
 */
export function calculatePatternSummary(
  session: GuidedIstikharaSession
): IstikharaPatternSummary {
  const reflections = session.reflections;
  
  if (reflections.length === 0) {
    return {
      totalDays: 0,
      calmDays: 0,
      uneasyDays: 0,
      inclinedDays: 0,
      resistantDays: 0,
      easeDays: 0,
      obstacleDays: 0,
      dominantEmotionalState: 'neutral',
      dominantDirectionFeeling: 'unclear',
      dominantEaseLevel: 'mixed',
      observationalSummary: 'No reflections recorded yet.',
    };
  }
  
  // Count occurrences
  const emotionalCounts: Record<EmotionalState, number> = {
    calm: 0,
    neutral: 0,
    uneasy: 0,
  };
  
  const directionCounts: Record<DirectionFeeling, number> = {
    inclined: 0,
    unclear: 0,
    resistant: 0,
  };
  
  const easeCounts: Record<EaseLevel, number> = {
    ease: 0,
    mixed: 0,
    obstacles: 0,
  };
  
  reflections.forEach((r) => {
    emotionalCounts[r.emotionalState]++;
    directionCounts[r.directionFeeling]++;
    easeCounts[r.easeLevel]++;
  });
  
  // Find dominant states
  const dominantEmotionalState = Object.entries(emotionalCounts).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0] as EmotionalState;
  
  const dominantDirectionFeeling = Object.entries(directionCounts).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0] as DirectionFeeling;
  
  const dominantEaseLevel = Object.entries(easeCounts).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0] as EaseLevel;
  
  // Generate observational text (NO VERDICTS)
  const observations: string[] = [];
  
  // Emotional pattern
  if (emotionalCounts.calm > reflections.length / 2) {
    observations.push('You noted calmness on most days.');
  } else if (emotionalCounts.uneasy > reflections.length / 2) {
    observations.push('Unease was recorded more frequently.');
  } else {
    observations.push('Emotional states varied across the reflection period.');
  }
  
  // Direction pattern
  if (directionCounts.inclined > reflections.length / 2) {
    observations.push('Inclination was felt more often than resistance.');
  } else if (directionCounts.resistant > reflections.length / 2) {
    observations.push('Resistance was recorded more frequently than ease.');
  } else if (directionCounts.unclear > reflections.length / 2) {
    observations.push('Clarity remained mixed throughout the period.');
  } else {
    observations.push('Directional feelings fluctuated during reflection.');
  }
  
  // Ease pattern
  if (easeCounts.ease > reflections.length / 2) {
    observations.push('You observed more ease than obstacles.');
  } else if (easeCounts.obstacles > reflections.length / 2) {
    observations.push('Obstacles were noted more than ease.');
  } else {
    observations.push('Experiences of ease and difficulty were mixed.');
  }
  
  // Final observational note (NO VERDICT)
  observations.push(
    'These are your recorded observations. You may wish to reflect further or consult trusted counsel.'
  );
  
  return {
    totalDays: reflections.length,
    calmDays: emotionalCounts.calm,
    uneasyDays: emotionalCounts.uneasy,
    inclinedDays: directionCounts.inclined,
    resistantDays: directionCounts.resistant,
    easeDays: easeCounts.ease,
    obstacleDays: easeCounts.obstacles,
    dominantEmotionalState,
    dominantDirectionFeeling,
    dominantEaseLevel,
    observationalSummary: observations.join(' '),
  };
}

/**
 * Clear all sessions (for testing or user request)
 */
export async function clearAllIstikharaSessions(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY_SESSIONS);
  } catch (error) {
    console.error('Failed to clear istikhara sessions:', error);
    throw error;
  }
}
