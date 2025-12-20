import { useState } from 'react';
import { calculateIstikhara } from '../services/api/istikhara';
import { IstikharaResponse, Language } from '../types/istikhara';

interface UseIstikharaReturn {
  calculate: (personName: string, motherName: string, language?: Language) => Promise<void>;
  reset: () => void;
  loading: boolean;
  error: string | null;
  result: IstikharaResponse | null;
}

/**
 * Custom hook for managing Istikhara calculation state
 */
export function useIstikhara(): UseIstikharaReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IstikharaResponse | null>(null);

  const calculate = async (
    personName: string,
    motherName: string,
    language: Language = 'en'
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await calculateIstikhara(personName, motherName, language);
      console.log('Hook received response:', response);
      setResult(response);
    } catch (err) {
      console.error('Hook caught error:', err);
      let errorMessage = 'An unknown error occurred';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        errorMessage = JSON.stringify(err);
      }
      
      console.error('Setting error message:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const reset = (): void => {
    setLoading(false);
    setError(null);
    setResult(null);
  };

  return {
    calculate,
    reset,
    loading,
    error,
    result,
  };
}
