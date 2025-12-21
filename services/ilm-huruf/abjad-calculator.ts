/**
 * Simplified Abjad Calculator
 * 
 * OPTION 1: Use this simplified version (no external dependencies)
 * OPTION 2: Copy full ilm-huruf/core.ts and all dependencies
 * 
 * This simplified version extracts only what's needed for Istikhara.
 * If you want full ilm-huruf functionality, copy core.ts instead.
 */

import { ABJAD_MAGHRIBI } from '../../constants/abjad-maps';

/**
 * Calculate Abjad value of Arabic text
 */
export function calculateAbjadValue(text: string): number {
  if (!text) return 0;
  
  let total = 0;
  for (const char of text) {
    const value = ABJAD_MAGHRIBI[char];
    if (value) {
      total += value;
    }
  }
  return total;
}

/**
 * Modulo with 1-based indexing (returns 1-base instead of 0-base)
 * Example: modIndex(13, 12) returns 1 (not 0)
 */
export function modIndex(value: number, base: number): number {
  const remainder = value % base;
  return remainder === 0 ? base : remainder;
}

/**
 * Calculate digital root (sum digits until single digit)
 */
export function digitalRoot(n: number): number {
  if (n === 0) return 0;
  return 1 + ((n - 1) % 9);
}
