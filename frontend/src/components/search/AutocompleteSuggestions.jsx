import searchIcon from '@/assets/icons/search.svg';

function highlightMatch(text, query) {
  if (!query || !text) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="suggestion-highlight">
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    )
  );
}

function getSuggestionText(suggestion) {
  if (typeof suggestion === 'string') return suggestion;
  return suggestion?.text || suggestion?.query || suggestion?.name || '';
}

export default function AutocompleteSuggestions({
  suggestions = [],
  activeIndex = -1,
  onSelect,
  onHover,
  query = '',
}) {
  if (!suggestions.length) return null;

  return (
    <ul
      id="search-suggestions-list"
      role="listbox"
      aria-label="Search suggestions"
      className="autocomplete-suggestions"
    >
      {suggestions.map((suggestion, index) => {
        const text = getSuggestionText(suggestion);
        const isActive = index === activeIndex;

        return (
          <li
            key={`suggestion-item-${index}`}
            id={`suggestion-item-${index}`}
            role="option"
            aria-selected={isActive}
            className={`autocomplete-suggestion-item${isActive ? ' autocomplete-suggestion-item--active' : ''}`}
            onMouseEnter={() => onHover && onHover(index)}
            onMouseLeave={() => onHover && onHover(-1)}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect && onSelect(suggestion);
            }}
          >
            <img
              src={searchIcon}
              alt=""
              aria-hidden="true"
              className="autocomplete-suggestion-icon"
            />
            <span className="autocomplete-suggestion-text">
              {highlightMatch(text, query)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
