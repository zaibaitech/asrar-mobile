import { useState } from 'react';
import { AbjadSystemKey, getAbjadMap, getActiveAbjadSystem } from '../constants/abjad-maps';
import { calculateIstikhara } from '../services/istikhara/calculations';
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
    /** Abjad system the totals were calculated with (app-wide choice). */
    abjadSystem?: AbjadSystemKey;
  };
}

type IstikharaResultLike = ReturnType<typeof calculateIstikhara>;

function toResponseData(localResult: IstikharaResultLike, abjadSystem: AbjadSystemKey): IstikharaResponse['data'] {
  return {
    personName: localResult.personName,
    motherName: localResult.motherName,
    personTotal: localResult.personTotal,
    motherTotal: localResult.motherTotal,
    combinedTotal: localResult.combinedTotal,
    burujRemainder: localResult.burujRemainder,
    element: localResult.burujProfile.element,
    burujProfile: localResult.burujProfile,
    repetitionCount: localResult.repetitionCount,
    abjadSystem,
  };
}

/**
 * Recalculate a name-based result with another Abjad system (same names, same
 * formula; used by the results screen when the user switches the system).
 * Not saved to history.
 */
export function recalculateIstikharaData(personName: string, motherName: string, abjadSystem: AbjadSystemKey): IstikharaResponse['data'] {
  return toResponseData(calculateIstikhara(personName.trim(), motherName.trim(), getAbjadMap(abjadSystem)), abjadSystem);
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
      const abjadSystem = getActiveAbjadSystem();
      const localResult = IstikharaService.calculate(personName, motherName, getAbjadMap(abjadSystem));
      
      // Transform to legacy response format for compatibility
      const response: IstikharaResponse = {
        success: true,
        data: toResponseData(localResult, abjadSystem),
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
