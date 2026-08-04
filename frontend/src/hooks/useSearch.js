import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/api/client';

const DEBOUNCE_DELAY_MS = 300;

const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const search = useCallback(async (searchQuery, params = {}) => {
    if (!searchQuery || !searchQuery.trim()) {
      setResults([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/search', {
        params: { q: searchQuery.trim(), ...params },
      });
      const data = response.data?.results ?? response.data ?? [];
      setResults(data);
    } catch (err) {
      setError(err?.response?.data?.message ?? err.message ?? 'Failed to fetch search results');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery || !searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      setSuggestLoading(true);
      const response = await api.get('/search/suggest', {
        params: { q: searchQuery.trim() },
      });
      const data = response.data?.suggestions ?? response.data ?? [];
      setSuggestions(data);
    } catch (err) {
      setSuggestions([]);
    } finally {
      setSuggestLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (!query || !query.trim()) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, DEBOUNCE_DELAY_MS);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, fetchSuggestions]);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    query,
    setQuery,
    results,
    suggestions,
    loading,
    suggestLoading,
    error,
    search,
    clearResults,
    clearSuggestions,
  };
};

export default useSearch;
