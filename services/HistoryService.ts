import AsyncStorage from '@react-native-async-storage/async-storage';
import type { IstikharaData } from '../types/istikhara';

export interface SavedCalculation {
  id: string;
  personName: string;
  motherName: string;
  result: IstikharaData;
  timestamp: string;
}

const HISTORY_KEY = '@istikhara_history';
const COUNT_KEY = '@istikhara_total_count';
const MAX_HISTORY = 10;

export class HistoryService {
  /**
   * Save a calculation to history
   */
  static async saveCalculation(
    result: IstikharaData,
    personName: string,
    motherName: string
  ): Promise<void> {
    try {
      const calculation: SavedCalculation = {
        id: Date.now().toString(),
        personName,
        motherName,
        result,
        timestamp: new Date().toISOString(),
      };

      const history = await this.getHistory();
      const updated = [calculation, ...history].slice(0, MAX_HISTORY);
      
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      
      // Update count
      const count = await this.getTotalCount();
      await AsyncStorage.setItem(COUNT_KEY, (count + 1).toString());
    } catch (error) {
      console.error('Failed to save calculation:', error);
    }
  }

  /**
   * Get all saved calculations
   */
  static async getHistory(): Promise<SavedCalculation[]> {
    try {
      const data = await AsyncStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load history:', error);
      return [];
    }
  }

  /**
   * Delete a specific calculation
   */
  static async deleteCalculation(id: string): Promise<void> {
    try {
      const history = await this.getHistory();
      const updated = history.filter(calc => calc.id !== id);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to delete calculation:', error);
    }
  }

  /**
   * Clear all history
   */
  static async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }

  /**
   * Get total calculation count
   */
  static async getTotalCount(): Promise<number> {
    try {
      const count = await AsyncStorage.getItem(COUNT_KEY);
      return count ? parseInt(count) : 0;
    } catch (error) {
      console.error('Failed to get count:', error);
      return 0;
    }
  }
}
