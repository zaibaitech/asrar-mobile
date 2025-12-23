/**
 * Hadad Core Type Definitions
 */

export type ElementType = 'fire' | 'water' | 'air' | 'earth';

export interface RuhHadad {
  element: ElementType;
  value: number;
  quality: string;
  description: string;
}

export interface UmHadad {
  motherElement: ElementType;
  total: number;
  influence: string;
}

export interface SacredResonance {
  nearest: number;
  resonance: number;
  description: string;
}
