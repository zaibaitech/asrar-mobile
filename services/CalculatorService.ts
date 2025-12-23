/**
 * Calculator Service
 * Business logic for calculator operations
 * Includes history management and batch calculations
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ABJAD_MAGHRIBI, ABJAD_MASHRIQI } from '../constants/abjad-maps';
import { calculateBurj } from '../constants/buruj';
import { CalculationResult, HistoryItem } from '../types/calculator';
import { calculateAbjadTotal, getDigitalRoot } from '../utils/abjad-calculations';
import { hadathToElement, nearestSacred, ruhHadad, withMother } from '../utils/hadad-core';
import { isArabicText, normalizeArabicText } from '../utils/text-normalize';

const HISTORY_KEY = '@asrar_calculator_history';
const MAX_HISTORY_ITEMS = 100;

export class CalculatorService {
  static async calculate(
    input: string,
    system: 'maghribi' | 'mashriqi' = 'maghribi',
    motherTotal?: number
  ): Promise<CalculationResult> {
    const normalized = normalizeArabicText(input);
    const isArabic = isArabicText(normalized);
    
    const map = system === 'maghribi' ? ABJAD_MAGHRIBI : ABJAD_MASHRIQI;
    const kabir = calculateAbjadTotal(normalized, map);
    const saghir = getDigitalRoot(kabir);
    const hadath = kabir % 4;
    const element = hadathToElement(hadath as 0 | 1 | 2 | 3);
    
    // Calculate Burj (Zodiac sign)
    const burjCalc = calculateBurj(kabir);
    const burj = burjCalc.name;
    
    const ruh = ruhHadad(kabir);
    const sacred = nearestSacred(kabir);
    const um = motherTotal ? withMother(kabir, motherTotal) : undefined;
    
    const result: CalculationResult = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      input: normalized,
      isArabic,
      system,
      kabir,
      saghir,
      hadath,
      element,
      burj,
      ruh: {
        value: ruh.value,
        element: ruh.element,
        description: ruh.description
      },
      sacred,
      um: um ? {
        total: um.total,
        element: um.motherElement
      } : undefined
    };
    
    return result;
  }
  
  static async saveToHistory(result: CalculationResult): Promise<void> {
    try {
      const history = await this.getHistory();
      const newHistory = [
        { id: result.id, result },
        ...history.slice(0, MAX_HISTORY_ITEMS - 1)
      ];
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save to history:', error);
    }
  }
  
  static async getHistory(): Promise<HistoryItem[]> {
    try {
      const data = await AsyncStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load history:', error);
      return [];
    }
  }
  
  static async deleteHistoryItem(id: string): Promise<void> {
    try {
      const history = await this.getHistory();
      const filtered = history.filter(item => item.id !== id);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete history item:', error);
    }
  }
  
  static async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }
  
  static async exportHistory(): Promise<string> {
    const history = await this.getHistory();
    return JSON.stringify(history, null, 2);
  }
}
