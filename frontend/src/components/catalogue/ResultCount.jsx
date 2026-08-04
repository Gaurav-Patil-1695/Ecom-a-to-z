import React from 'react';

/**
 * ResultCount
 *
 * Displays the total number of results and optional per-option facet counts.
 *
 * Props:
 *   total        : number | null  — total number of results
 *   loading      : boolean        — show skeleton when true
 *   facets       : Array<{ label: string, count: number }> | null
 *                  — optional per-option facet counts to display inline
 *   noun         : string         — singular noun for results (default: 'result')
 */
const ResultCount = ({
  total = null,
  loading = false,
  facets = null,
  noun = 'result',
}) => {
  if (loading) {
    return (
      <div
        className="result-count result-count--loading"
        aria-busy="true"
        aria-label="Loading result count"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          minHeight: '22px',
        }}
      >
        <div
          style={{
            height: '14px',
            width: '120px',
            borderRadius: '4px',
            background: '#f3f4f6',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
              backgroundSize: '200% 100%',
              animation: 'result-count-shimmer 1.5s infinite',
            }}
          />
        </div>
        <style>{`
          @keyframes result-count-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  if (total === null || total === undefined) return null;

  const formattedTotal = new Intl.NumberFormat('en-IN').format(total);
  const pluralisedNoun = total === 1 ? noun : `${noun}s`;

  const hasFacets = Array.isArray(facets) && facets.length > 0;

  return (
    <div
      className="result-count"
      aria-live="polite"
      aria-atomic="true"
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '6px',
        lineHeight: 1.4,
      }}
    >
      {/* Total count */}
      <span
        className="result-count__total"
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#111827',
          flexShrink: 0,
        }}
      >
        {formattedTotal}
      </span>
      <span
        className="result-count__noun"
        style={{
          fontSize: '13px',
          fontWeight: 400,
          color: '#6b7280',
          flexShrink: 0,
        }}
      >
        {pluralisedNoun} found
      </span>

      {/* Per-option facet counts */}
      {hasFacets && (
        <>
          <span
            aria-hidden="true"
            style={{
              fontSize: '12px',
              color: '#d1d5db',
              flexShrink: 0,
              lineHeight: 1,
            }}
          >
            ·
          </span>
          <ul
            className="result-count__facets"
            aria-label="Results by option"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {facets.map((facet, idx) => (
              <li
                key={`${facet.label}-${idx}`}
                className="result-count__facet"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    color: '#374151',
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}
                >
                  {facet.label}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f3f4f6',
                    color: '#6b7280',
                    fontSize: '11px',
                    fontWeight: 500,
                    borderRadius: '10px',
                    padding: '1px 7px',
                    minWidth: '24px',
                    lineHeight: '18px',
                  }}
                  aria-label={`${new Intl.NumberFormat('en-IN').format(facet.count)} results for ${facet.label}`}
                >
                  {new Intl.NumberFormat('en-IN').format(facet.count)}
                </span>
                {idx < facets.length - 1 && (
                  <span
                    aria-hidden="true"
                    style={{
                      fontSize: '12px',
                      color: '#d1d5db',
                      marginLeft: '2px',
                      lineHeight: 1,
                    }}
                  >
                    ·
                  </span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ResultCount;
