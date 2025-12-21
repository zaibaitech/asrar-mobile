import { useState } from 'react';
import { IstikharaService } from '../services/IstikharaService';

// Legacy response format for compatibility with existing components
interface IstikharaResponse {
  success: boolean;
  data: {
    personName: string;
    motherName: string;
    personTotal: number;
    motherTotal: number;
    combinedTotal: number;
    burujRemainder: number;
    element: 'fire' | 'earth' | 'air' | 'water';
    burujProfile: any;
    repetitionCount: number;
  };
}

interface UseIstikharaReturn {
  calculate: (personName: string, motherName: string, language?: string) => Promise<void>;
  reset: () => void;
  loading: boolean;
  error: string | null;
  result: IstikharaResponse | null;
}

/**
 * Custom hook for managing Istikhara calculation state
 * NOW USES LOCAL CALCULATIONS - No API required!
 */
export function useIstikhara(): UseIstikharaReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IstikharaResponse | null>(null);

  const calculate = async (
    personName: string,
    motherName: string,
    language: string = 'en'
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Use local calculation service (synchronous, no await needed)
      const localResult = IstikharaService.calculate(personName, motherName);
      
      // Transform to legacy response format for compatibility
      const response: IstikharaResponse = {
        success: true,
        data: {
          personName: localResult.personName,
          motherName: localResult.motherName,
          personTotal: localResult.personTotal,
          motherTotal: localResult.motherTotal,
          combinedTotal: localResult.combinedTotal,
          burujRemainder: localResult.burujRemainder,
          element: localResult.burujProfile.element,
          burujProfile: localResult.burujProfile,
          repetitionCount: localResult.repetitionCount,
        }
      };
      
      console.log('✅ Local calculation successful:', response);
      setResult(response);
    } catch (err) {
      console.error('❌ Local calculation error:', err);
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
