/**
 * Istikhara Service - Main Mobile Service
 * 
 * This is the main interface for your app to use.
 * DO NOT modify this file - it will work once you paste the other files.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateIstikhara } from './istikhara/calculations';
import type { IstikharaCalculationResult } from './istikhara/types';

export interface SavedCalculation {
  personName: string;
  motherName: string;
  result: IstikharaCalculationResult;
  timestamp: string;
}

const HISTORY_KEY = 'istikhara_history';
const MAX_HISTORY = 50;

export class IstikharaService {
  /**
   * Calculate Istikhara locally (no API call)
   */
  static calculate(
    personName: string,
    motherName: string
  ): IstikharaCalculationResult {
    try {
      // Validate
      if (!personName || !motherName) {
        throw new Error('Both names are required');
      }

      // Calculate locally
      const result = calculateIstikhara(
        personName.trim(),
        motherName.trim()
      );

      // Save to history (async, don't wait)
      this.saveToHistory({
        personName: result.personName,
        motherName: result.motherName,
        result: result,
        timestamp: new Date().toISOString()
      }).catch(err => console.error('Failed to save history:', err));

      return result;

    } catch (error) {
      console.error('Istikhara calculation error:', error);
      throw error;
    }
  }

  /**
   * Get calculation history
   */
  static async getHistory(): Promise<SavedCalculation[]> {
    try {
      const json = await AsyncStorage.getItem(HISTORY_KEY);
      return json ? JSON.parse(json) : [];
    } catch (error) {
      console.error('Failed to load history:', error);
      return [];
    }
  }

  /**
   * Save calculation to history
   */
  static async saveToHistory(calculation: SavedCalculation): Promise<void> {
    try {
      const history = await this.getHistory();
      
      // Add new calculation at start
      history.unshift(calculation);
      
      // Keep last MAX_HISTORY items
      const trimmed = history.slice(0, MAX_HISTORY);
      
      // Save
      await AsyncStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(trimmed)
      );
    } catch (error) {
      console.error('Failed to save to history:', error);
    }
  }

  /**
   * Clear all history
   */
  static async clearHistory(): Promise<void> {
    await AsyncStorage.removeItem(HISTORY_KEY);
  }

  /**
   * Delete specific calculation from history
   */
  static async deleteFromHistory(timestamp: string): Promise<void> {
    try {
      const history = await this.getHistory();
      const filtered = history.filter(item => item.timestamp !== timestamp);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete from history:', error);
    }
  }
}
