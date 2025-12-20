import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  IstikharaRequest,
  IstikharaResponse,
  IstikharaError,
  IstikharaHistoryItem,
  Language,
} from '../../types/istikhara';

const API_BASE_URL = 'https://asrar-everyday.vercel.app/api/v1';
const HISTORY_STORAGE_KEY = 'istikhara_history';

/**
 * Calculate Istikhara using the Asrar Everyday API
 */
export async function calculateIstikhara(
  personName: string,
  motherName: string,
  language: Language = 'en'
): Promise<IstikharaResponse> {
  try {
    const requestData: IstikharaRequest = {
      personName: personName.trim(),
      motherName: motherName.trim(),
      language,
    };

    const response = await axios.post<IstikharaResponse>(
      `${API_BASE_URL}/istikhara`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000, // 15 second timeout
      }
    );

    // Save successful calculation to history
    if (response.data.success) {
      await saveToHistory(personName, motherName, response.data);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<IstikharaError>;
      
      if (axiosError.response?.data) {
        throw new Error(
          axiosError.response.data.message || 
          axiosError.response.data.error || 
          'Failed to calculate Istikhara'
        );
      }
      
      if (axiosError.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please check your connection and try again.');
      }
      
      if (!axiosError.response) {
        throw new Error('Network error. Please check your internet connection.');
      }
    }
    
    throw new Error('An unexpected error occurred. Please try again.');
  }
}

/**
 * Save successful calculation to AsyncStorage history
 */
async function saveToHistory(
  personName: string,
  motherName: string,
  response: IstikharaResponse
): Promise<void> {
  try {
    const historyItem: IstikharaHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      personName,
      motherName,
      result: response.data,
      timestamp: response.timestamp,
    };

    // Get existing history
    const existingHistoryJson = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    const existingHistory: IstikharaHistoryItem[] = existingHistoryJson
      ? JSON.parse(existingHistoryJson)
      : [];

    // Add new item to beginning of array
    const updatedHistory = [historyItem, ...existingHistory];

    // Keep only the last 50 calculations
    const trimmedHistory = updatedHistory.slice(0, 50);

    // Save back to storage
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    // Don't throw error if history save fails - it's not critical
    console.error('Failed to save to history:', error);
  }
}

/**
 * Get calculation history from AsyncStorage
 */
export async function getHistory(): Promise<IstikharaHistoryItem[]> {
  try {
    const historyJson = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

/**
 * Clear all calculation history
 */
export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
    throw new Error('Failed to clear history');
  }
}

/**
 * Check if history exists
 */
export async function hasHistory(): Promise<boolean> {
  try {
    const history = await getHistory();
    return history.length > 0;
  } catch {
    return false;
  }
}
