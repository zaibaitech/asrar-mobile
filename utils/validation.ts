/**
 * Input Validation Utilities
 * 
 * PASTE CONTENT FROM WEB APP (OPTIONAL):
 * File: /src/lib/api-validation.ts
 * 
 * Should contain:
 * - validateName(name)
 * - validateLanguage(lang)
 */

import { isArabicText } from './text-normalize';

/**
 * Validate name input
 */
export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  
  if (!isArabicText(name)) {
    return { valid: false, error: 'Name must be in Arabic script' };
  }
  
  return { valid: true };
}

/**
 * Validate language code
 */
export function validateLanguage(lang: string): boolean {
  return ['en', 'fr', 'ar'].includes(lang);
}
