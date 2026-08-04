import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '@/assets/icons/search.svg';
import closeIcon from '@/assets/icons/close.svg';
import AutocompleteSuggestions from './AutocompleteSuggestions';

const DEBOUNCE_DELAY = 300;

export default function SearchBar({ initialQuery = '', className = '' }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  const fetchSuggestions = useCallback(async (value) => {
    if (!value.trim() || value.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    setIsLoading(true);
    try {
      const params = new URLSearchParams({ q: value.trim() });
      const response = await fetch(`/api/search/suggest?${params.toString()}`, {
        signal: abortRef.current.signal,
        credentials: 'include',
      });
      if (!response.ok) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }
      const data = await response.json();
      const items = Array.isArray(data?.suggestions) ? data.suggestions : Array.isArray(data) ? data : [];
      setSuggestions(items);
      setIsOpen(items.length > 0);
      setActiveIndex(-1);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setSuggestions([]);
        setIsOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, DEBOUNCE_DELAY);
  };

  const submitSearch = (searchQuery) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    setIsOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        submitSearch(query);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          const selected = suggestions[activeIndex];
          const selectedText = typeof selected === 'string' ? selected : selected?.text || selected?.query || selected?.name || '';
          setQuery(selectedText);
          submitSearch(selectedText);
        } else {
          submitSearch(query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    const text = typeof suggestion === 'string' ? suggestion : suggestion?.text || suggestion?.query || suggestion?.name || '';
    setQuery(text);
    submitSearch(text);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeIndex >= 0 && activeIndex < suggestions.length) {
      const selected = suggestions[activeIndex];
      const selectedText = typeof selected === 'string' ? selected : selected?.text || selected?.query || selected?.name || '';
      setQuery(selectedText);
      submitSearch(selectedText);
    } else {
      submitSearch(query);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return (
    <div ref={containerRef} className={`search-bar-container ${className}`} role="search">
      <form onSubmit={handleSubmit} autoComplete="off" noValidate>
        <div className="search-bar-inner">
          <button
            type="submit"
            className="search-bar-icon-btn"
            aria-label="Search"
          >
            <img src={searchIcon} alt="" aria-hidden="true" className="search-bar-icon" />
          </button>

          <input
            ref={inputRef}
            type="search"
            id="global-search-input"
            name="q"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            placeholder="Search products, brands and more…"
            className="search-bar-input"
            aria-label="Search"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls={isOpen ? 'search-suggestions-list' : undefined}
            aria-activedescendant={
              isOpen && activeIndex >= 0 ? `suggestion-item-${activeIndex}` : undefined
            }
            autoComplete="off"
            spellCheck={false}
          />

          {query.length > 0 && (
            <button
              type="button"
              className="search-bar-clear-btn"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <img src={closeIcon} alt="" aria-hidden="true" className="search-bar-clear-icon" />
            </button>
          )}

          {isLoading && (
            <span className="search-bar-spinner" aria-label="Loading suggestions" role="status" />
          )}
        </div>
      </form>

      {isOpen && suggestions.length > 0 && (
        <AutocompleteSuggestions
          suggestions={suggestions}
          activeIndex={activeIndex}
          onSelect={handleSuggestionSelect}
          onHover={(index) => setActiveIndex(index)}
          query={query}
        />
      )}
    </div>
  );
}
