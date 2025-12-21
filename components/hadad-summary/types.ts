/**
 * Hadad Summary Types
 * Type definitions for hadad-core
 */

export type ElementType = 'Fire' | 'Water' | 'Air' | 'Earth';

export interface RuhHadad {
  value: number;
  root: number;
  element: ElementType;
}

export interface UmHadad {
  total: number;
  root: number;
  hadath: ElementType;
}

export interface SacredResonance {
  nearest: number;
  delta: number;
  isExact: boolean;
  factors: number[];
  divisibleBy7: boolean;
  div7: boolean;
  divisibleBy19: boolean;
  div19: boolean;
  divisibleBy99: boolean;
  div99: boolean;
}
