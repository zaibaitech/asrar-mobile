/**
 * Calculator Type Definitions
 * TypeScript interfaces for calculator module
 */

import { ElementType } from '../utils/types';

export interface CalculationResult {
  id: string;
  timestamp: number;
  input: string;
  isArabic: boolean;
  system: 'maghribi' | 'mashriqi';
  
  // Core results
  kabir: number;
  saghir: number;
  hadath: number;
  element: ElementType;
  burj?: string;
  
  // Enhanced results
  ruh?: {
    value: number;
    element: ElementType;
    description: string;
  };
  um?: {
    total: number;
    element: ElementType;
  };
  sacred?: {
    nearest: number;
    resonance: number;
    description: string;
  };
  
  // Life path analysis
  lifePath?: {
    expressionNumber?: number;
    soulUrge?: number;
    personality?: number;
    birthdayNumber?: number;
  };
}

export interface HistoryItem {
  id: string;
  result: CalculationResult;
}

export interface CalculatorState {
  latinInput: string;
  arabicInput: string;
  currentResult: CalculationResult | null;
  history: HistoryItem[];
  selectedSystem: 'maghribi' | 'mashriqi';
  isLoading: boolean;
}

export interface CalculatorSettings {
  defaultSystem: 'maghribi' | 'mashriqi';
  autoTransliterate: boolean;
  showBreakdown: boolean;
  saveHistory: boolean;
}
