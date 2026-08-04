import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Breadcrumb trail component.
 *
 * Props:
 *   items: Array<{ label: string, to?: string }>
 *     - Each item has a label. If `to` is provided the item renders as a link.
 *     - The last item is treated as the current page and rendered as plain text.
 */
const Breadcrumb = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb" style={styles.nav}>
      <ol className="breadcrumb__list" style={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={index}
              className="breadcrumb__item"
              style={styles.item}
              aria-current={isLast ? 'page' : undefined}
            >
              {!isLast && item.to ? (
                <>
                  <Link
                    to={item.to}
                    className="breadcrumb__link"
                    style={styles.link}
                  >
                    {item.label}
                  </Link>
                  <span
                    className="breadcrumb__separator"
                    style={styles.separator}
                    aria-hidden="true"
                  >
                    /
                  </span>
                </>
              ) : (
                <span
                  className="breadcrumb__current"
                  style={isLast ? styles.current : styles.linkPlain}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
  },
  list: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.25rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  link: {
    fontSize: '0.875rem',
    color: '#4f46e5',
    textDecoration: 'none',
    transition: 'color 0.15s',
  },
  linkPlain: {
    fontSize: '0.875rem',
    color: '#374151',
  },
  current: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: 500,
  },
  separator: {
    fontSize: '0.875rem',
    color: '#9ca3af',
    userSelect: 'none',
    marginLeft: '0.25rem',
  },
};

export default Breadcrumb;
