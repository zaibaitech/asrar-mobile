import { useEffect, useState } from 'react';
import { getNameDisplayLabel, searchNameTransliterations } from '../data/nameTransliterations';

export interface NameSuggestion {
  latin: string;
  arabic: string;
}

export function useNameSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<NameSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = () => {
      setLoading(true);
      try {
        // Search local name database
        const matches = searchNameTransliterations(query);
        
        // Convert NameMatch[] to NameSuggestion[]
        const convertedSuggestions: NameSuggestion[] = matches.map(match => ({
          latin: getNameDisplayLabel(match),
          arabic: match.arabic
        }));
        
        setSuggestions(convertedSuggestions.slice(0, 10)); // Limit to 10 suggestions
      } catch (error) {
        console.error('Error searching names:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return { suggestions, loading };
}
