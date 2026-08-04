import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';

/**
 * CategoryNav
 *
 * Category tree navigation menu.
 *
 * Props:
 *   categories   : Array<Category> — flat or nested list of categories
 *   activeCategoryId : string | number | null — currently active category
 *   onCategorySelect : (category: Category) => void — optional click handler
 *
 * Each Category object shape:
 *   {
 *     id          : string | number,
 *     name        : string,
 *     slug        : string | null,
 *     parentId    : string | number | null,
 *     children    : Array<Category> | null,  // pre-nested OR use parentId to build tree
 *     productCount : number | null,
 *   }
 */

const buildTree = (categories) => {
  if (!categories || categories.length === 0) return [];

  const map = {};
  const roots = [];

  categories.forEach((cat) => {
    map[cat.id] = { ...cat, children: cat.children || [] };
  });

  categories.forEach((cat) => {
    if (cat.parentId && map[cat.parentId]) {
      const alreadyChild = map[cat.parentId].children.some(
        (c) => c.id === cat.id
      );
      if (!alreadyChild) {
        map[cat.parentId].children.push(map[cat.id]);
      }
    } else if (!cat.parentId) {
      const alreadyRoot = roots.some((r) => r.id === cat.id);
      if (!alreadyRoot) {
        roots.push(map[cat.id]);
      }
    }
  });

  return roots;
};

const isAlreadyNested = (categories) => {
  if (!categories || categories.length === 0) return false;
  return categories.some(
    (cat) => Array.isArray(cat.children) && cat.children.length > 0
  );
};

const categoryLinkPath = (cat) => {
  if (cat.slug) return `/categories/${cat.slug}`;
  return `/categories/${cat.id}`;
};

const countBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f3f4f6',
  color: '#9ca3af',
  fontSize: '10px',
  fontWeight: 500,
  borderRadius: '999px',
  padding: '1px 6px',
  minWidth: '24px',
  lineHeight: '16px',
  flexShrink: 0,
};

const CategoryTreeNode = ({
  category,
  depth,
  activeCategoryId,
  onCategorySelect,
  defaultOpen,
}) => {
  const hasChildren =
    Array.isArray(category.children) && category.children.length > 0;

  const isActive =
    activeCategoryId !== null &&
    activeCategoryId !== undefined &&
    String(category.id) === String(activeCategoryId);

  const hasActiveDescendant = useCallback(
    (node) => {
      if (!node.children || node.children.length === 0) return false;
      return node.children.some(
        (child) =>
          String(child.id) === String(activeCategoryId) ||
          hasActiveDescendant(child)
      );
    },
    [activeCategoryId]
  );

  const [open, setOpen] = useState(
    () => defaultOpen || isActive || hasActiveDescendant(category)
  );

  const toggleOpen = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen((prev) => !prev);
    },
    []
  );

  const handleSelect = useCallback(
    (e) => {
      if (onCategorySelect) {
        onCategorySelect(category);
      }
    },
    [category, onCategorySelect]
  );

  const indentLeft = depth * 14;

  const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    textDecoration: 'none',
    color: isActive ? '#15803d' : depth === 0 ? '#111827' : '#374151',
    fontWeight: isActive ? 600 : depth === 0 ? 600 : 400,
    fontSize: depth === 0 ? '14px' : '13px',
    lineHeight: 1.4,
    paddingLeft: `${indentLeft}px`,
    paddingTop: '7px',
    paddingBottom: '7px',
    paddingRight: '8px',
    borderRadius: '6px',
    background: isActive ? '#f0fdf4' : 'transparent',
    transition: 'background 0.15s ease, color 0.15s ease',
    flex: 1,
    minWidth: 0,
    cursor: 'pointer',
  };

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    width: '100%',
    borderRadius: '6px',
  };

  return (
    <li
      style={{ listStyle: 'none', margin: 0, padding: 0 }}
      aria-current={isActive ? 'page' : undefined}
    >
      <div style={rowStyle}>
        <Link
          to={categoryLinkPath(category)}
          style={linkStyle}
          onClick={handleSelect}
          aria-label={
            category.productCount !== undefined && category.productCount !== null
              ? `${category.name} (${category.productCount} products)`
              : category.name
          }
        >
          <span
            style={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {category.name}
          </span>
          {category.productCount !== undefined &&
            category.productCount !== null && (
              <span style={countBadgeStyle}>
                {category.productCount.toLocaleString('en-IN')}
              </span>
            )}
        </Link>

        {hasChildren && (
          <button
            type="button"
            onClick={toggleOpen}
            aria-expanded={open}
            aria-label={`${open ? 'Collapse' : 'Expand'} ${category.name}`}
            style={{
              background: 'none',
              border: 'none',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              flexShrink: 0,
              color: '#6b7280',
              transition: 'background 0.15s ease',
            }}
          >
            <img
              src={chevronDownIcon}
              alt=""
              aria-hidden="true"
              width={14}
              height={14}
              style={{
                display: 'block',
                transition: 'transform 0.2s ease',
                transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
              }}
            />
          </button>
        )}
      </div>

      {hasChildren && open && (
        <ul
          style={{ listStyle: 'none', margin: 0, padding: 0 }}
          role="group"
          aria-label={`${category.name} subcategories`}
        >
          {category.children.map((child) => (
            <CategoryTreeNode
              key={child.id}
              category={child}
              depth={depth + 1}
              activeCategoryId={activeCategoryId}
              onCategorySelect={onCategorySelect}
              defaultOpen={false}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const CategoryNav = ({
  categories = [],
  activeCategoryId,
  onCategorySelect,
  title = 'Categories',
  loading = false,
}) => {
  const tree = isAlreadyNested(categories)
    ? categories
    : buildTree(categories);

  if (loading) {
    return (
      <nav
        aria-label="Category navigation"
        aria-busy="true"
        style={{
          width: '100%',
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          padding: '0 16px 12px',
          boxSizing: 'border-box',
        }}
      >
        {title && (
          <div
            style={{
              padding: '14px 0 10px',
              borderBottom: '1px solid #e5e7eb',
              marginBottom: '10px',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: '15px',
                fontWeight: 700,
                color: '#111827',
                lineHeight: 1.3,
              }}
            >
              {title}
            </h2>
          </div>
        )}
        <ul
          role="status"
          aria-label="Loading categories"
          style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <div
                aria-hidden="true"
                style={{
                  height: '16px',
                  width: `${60 + (i % 3) * 15}%`,
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
                    animation: 'skeleton-shimmer 1.5s infinite',
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  if (!tree || tree.length === 0) {
    return (
      <nav
        aria-label="Category navigation"
        style={{
          width: '100%',
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          padding: '0 16px 12px',
          boxSizing: 'border-box',
        }}
      >
        {title && (
          <div
            style={{
              padding: '14px 0 10px',
              borderBottom: '1px solid #e5e7eb',
              marginBottom: '10px',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: '15px',
                fontWeight: 700,
                color: '#111827',
                lineHeight: 1.3,
              }}
            >
              {title}
            </h2>
          </div>
        )}
        <p
          style={{
            fontSize: '13px',
            color: '#9ca3af',
            margin: '12px 0 4px',
          }}
        >
          No categories available.
        </p>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Category navigation"
      style={{
        width: '100%',
        background: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        padding: '0 16px 12px',
        boxSizing: 'border-box',
      }}
    >
      {title && (
        <div
          style={{
            padding: '14px 0 10px',
            borderBottom: '1px solid #e5e7eb',
            marginBottom: '4px',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '15px',
              fontWeight: 700,
              color: '#111827',
              lineHeight: 1.3,
            }}
          >
            {title}
          </h2>
        </div>
      )}

      <ul
        role="tree"
        aria-label={title || 'Category tree'}
        style={{
          listStyle: 'none',
          margin: 0,
          padding: '6px 0 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0px',
        }}
      >
        {tree.map((category) => (
          <CategoryTreeNode
            key={category.id}
            category={category}
            depth={0}
            activeCategoryId={activeCategoryId}
            onCategorySelect={onCategorySelect}
            defaultOpen={
              activeCategoryId !== null &&
              activeCategoryId !== undefined &&
              String(category.id) === String(activeCategoryId)
            }
          />
        ))}
      </ul>
    </nav>
  );
};

export default CategoryNav;
