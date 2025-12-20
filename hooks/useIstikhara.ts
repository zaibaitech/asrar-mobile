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
      setResult(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
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
