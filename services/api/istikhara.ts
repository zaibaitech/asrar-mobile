import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    IstikharaHistoryItem,
    IstikharaRequest,
    IstikharaResponse,
    Language
} from '../../types/istikhara';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000'  // Use proxy in development
  : 'https://www.asrar.app/api/v1';
const HISTORY_STORAGE_KEY = 'istikhara_history';

/**
 * Calculate Istikhara using the Asrar Everyday API
 * Using fetch instead of axios for better Expo compatibility
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

    console.log('Sending Istikhara request:', requestData);

    const response = await fetch(`${API_BASE_URL}/istikhara`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const data: IstikharaResponse = await response.json();
    console.log('Received Istikhara response:', JSON.stringify(data, null, 2));

    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from server');
    }

    if (!data.success) {
      throw new Error('Calculation failed');
    }

    if (!data.data) {
      throw new Error('Missing data in response');
    }

    // Save successful calculation to history
    if (data.success) {
      await saveToHistory(personName, motherName, data);
    }

    return data;
  } catch (error) {
    console.error('Istikhara calculation error:', error);
    
    if (error instanceof TypeError && error.message.includes('Network request failed')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    // Handle non-Axios errors
    if (error instanceof Error) {
      throw new Error(error.message);
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
