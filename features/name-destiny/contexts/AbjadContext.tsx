/**
 * Abjad Context - Manage Abjad System Selection
 * Mobile Implementation - Expo Go 54
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AbjadSystem = 'maghribi' | 'mashriqi';

interface AbjadContextType {
  abjadSystem: AbjadSystem;
  setAbjadSystem: (system: AbjadSystem) => void;
  toggleAbjadSystem: () => void;
}

const AbjadContext = createContext<AbjadContextType | undefined>(undefined);

interface AbjadProviderProps {
  children: ReactNode;
}

export function AbjadProvider({ children }: AbjadProviderProps) {
  const [abjadSystem, setAbjadSystem] = useState<AbjadSystem>('maghribi');

  const toggleAbjadSystem = () => {
    setAbjadSystem((prev) => (prev === 'maghribi' ? 'mashriqi' : 'maghribi'));
  };

  return (
    <AbjadContext.Provider
      value={{
        abjadSystem,
        setAbjadSystem,
        toggleAbjadSystem,
      }}
    >
      {children}
    </AbjadContext.Provider>
  );
}

export function useAbjad(): AbjadContextType {
  const context = useContext(AbjadContext);
  if (!context) {
    throw new Error('useAbjad must be used within AbjadProvider');
  }
  return context;
}
