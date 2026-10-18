/**
 * Abjad Context - Name Destiny view of the app-wide Abjad system.
 * Mobile Implementation - Expo Go 54
 *
 * The system is app-wide (hooks/useAbjadSystem, persisted in AsyncStorage) so a
 * switch here also switches every other calculator. The provider is kept so the
 * existing layouts keep working.
 */

import React, { ReactNode } from 'react';
import { useAbjadSystem } from '../../../hooks/useAbjadSystem';

type AbjadSystem = 'maghribi' | 'mashriqi';

interface AbjadContextType {
  abjadSystem: AbjadSystem;
  setAbjadSystem: (system: AbjadSystem) => void;
  toggleAbjadSystem: () => void;
}

interface AbjadProviderProps {
  children: ReactNode;
}

export function AbjadProvider({ children }: AbjadProviderProps) {
  return <>{children}</>;
}

export function useAbjad(): AbjadContextType {
  const { system, setSystem } = useAbjadSystem();
  return {
    abjadSystem: system,
    setAbjadSystem: setSystem,
    toggleAbjadSystem: () => setSystem(system === 'maghribi' ? 'mashriqi' : 'maghribi'),
  };
}
