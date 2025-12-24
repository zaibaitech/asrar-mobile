/**
 * Name Destiny Storage Service
 * Handles history and favorites persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NameDestinyResult } from '../types';

export interface StoredCalculation {
  id: string;
  personName: string;
  motherName?: string;
  result: NameDestinyResult;
  timestamp: string;
  isFavorite?: boolean;
}

const HISTORY_KEY = '@name_destiny_history';
const FAVORITES_KEY = '@name_destiny_favorites';
const MAX_HISTORY = 50;
const MAX_FAVORITES = 20;

export class NameDestinyStorageService {
  /**
   * Save calculation to history
   */
  static async saveToHistory(
    personName: string,
    motherName: string | undefined,
    result: NameDestinyResult
  ): Promise<void> {
    try {
      const calculation: StoredCalculation = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        personName,
        motherName,
        result,
        timestamp: new Date().toISOString(),
      };

      const history = await this.getHistory();
      const updated = [calculation, ...history].slice(0, MAX_HISTORY);
      
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save to history:', error);
    }
  }

  /**
   * Get all history
   */
  static async getHistory(): Promise<StoredCalculation[]> {
    try {
      const data = await AsyncStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load history:', error);
      return [];
    }
  }

  /**
   * Delete calculation from history
   */
  static async deleteFromHistory(id: string): Promise<void> {
    try {
      const history = await this.getHistory();
      const updated = history.filter(calc => calc.id !== id);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to delete from history:', error);
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
   * Add to favorites
   */
  static async addToFavorites(calculation: StoredCalculation): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      
      // Check if already in favorites
      if (favorites.some(fav => fav.id === calculation.id)) {
        return;
      }

      const updated = [
        { ...calculation, isFavorite: true },
        ...favorites
      ].slice(0, MAX_FAVORITES);
      
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to add to favorites:', error);
    }
  }

  /**
   * Remove from favorites
   */
  static async removeFromFavorites(id: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const updated = favorites.filter(fav => fav.id !== id);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
    }
  }

  /**
   * Get all favorites
   */
  static async getFavorites(): Promise<StoredCalculation[]> {
    try {
      const data = await AsyncStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load favorites:', error);
      return [];
    }
  }

  /**
   * Check if calculation is favorited
   */
  static async isFavorite(id: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(fav => fav.id === id);
    } catch (error) {
      return false;
    }
  }

  /**
   * Clear all favorites
   */
  static async clearFavorites(): Promise<void> {
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
    } catch (error) {
      console.error('Failed to clear favorites:', error);
    }
  }

  /**
   * Get storage stats
   */
  static async getStats(): Promise<{ historyCount: number; favoritesCount: number }> {
    try {
      const history = await this.getHistory();
      const favorites = await this.getFavorites();
      
      return {
        historyCount: history.length,
        favoritesCount: favorites.length,
      };
    } catch (error) {
      return { historyCount: 0, favoritesCount: 0 };
    }
  }
}
