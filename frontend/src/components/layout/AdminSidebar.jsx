import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navSections = [
  {
    heading: 'Overview',
    items: [
      { label: 'Dashboard', to: '/admin' },
      { label: 'Reports', to: '/admin/reports' },
    ],
  },
  {
    heading: 'Orders',
    items: [
      { label: 'All Orders', to: '/admin/orders' },
      { label: 'Returns', to: '/admin/returns' },
    ],
  },
  {
    heading: 'Catalogue',
    items: [
      { label: 'Products', to: '/admin/products' },
      { label: 'Categories', to: '/admin/categories' },
      { label: 'Brands', to: '/admin/brands' },
    ],
  },
  {
    heading: 'Promotions',
    items: [
      { label: 'Promo Codes', to: '/admin/promotions' },
    ],
  },
  {
    heading: 'Users',
    items: [
      { label: 'All Users', to: '/admin/users' },
    ],
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="admin-sidebar"
      style={{
        ...styles.sidebar,
        width: collapsed ? '56px' : '220px',
      }}
      aria-label="Admin navigation"
    >
      {/* Collapse toggle */}
      <button
        type="button"
        className="admin-sidebar__toggle"
        style={styles.toggleBtn}
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <span style={styles.toggleIcon}>{collapsed ? '\u00bb' : '\u00ab'}</span>
      </button>

      <nav className="admin-sidebar__nav" aria-label="Admin sections">
        {navSections.map((section) => (
          <div key={section.heading} className="admin-sidebar__section" style={styles.section}>
            {!collapsed && (
              <p className="admin-sidebar__section-heading" style={styles.sectionHeading}>
                {section.heading}
              </p>
            )}
            <ul style={styles.list}>
              {section.items.map((item) => {
                const isActive =
                  item.to === '/admin'
                    ? location.pathname === '/admin'
                    : location.pathname.startsWith(item.to);
                return (
                  <li key={item.to} style={styles.listItem}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/admin'}
                      title={collapsed ? item.label : undefined}
                      style={({ isActive: navActive }) => ({
                        ...styles.navLink,
                        ...(navActive || isActive ? styles.navLinkActive : {}),
                      })}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {!collapsed && <span style={styles.linkLabel}>{item.label}</span>}
                      {collapsed && (
                        <span
                          style={styles.collapsedDot}
                          aria-hidden="true"
                        >
                          {item.label.charAt(0)}
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

const styles = {
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#1e1b4b',
    color: '#c7d2fe',
    flexShrink: 0,
    transition: 'width 0.2s ease',
    overflowX: 'hidden',
    overflowY: 'auto',
    minHeight: 0,
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#a5b4fc',
    padding: '0.75rem',
    borderBottom: '1px solid #312e81',
    width: '100%',
  },
  toggleIcon: {
    fontSize: '1rem',
    lineHeight: 1,
    userSelect: 'none',
  },
  section: {
    padding: '0.5rem 0',
    borderBottom: '1px solid #312e81',
  },
  sectionHeading: {
    fontSize: '0.6875rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#6366f1',
    margin: '0.5rem 0.875rem 0.25rem',
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  listItem: {
    margin: 0,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 0.875rem',
    fontSize: '0.875rem',
    color: '#c7d2fe',
    textDecoration: 'none',
    borderRadius: '0',
    transition: 'background-color 0.15s, color 0.15s',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  navLinkActive: {
    backgroundColor: '#4338ca',
    color: '#ffffff',
    fontWeight: 600,
  },
  linkLabel: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  collapsedDot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    fontSize: '0.8125rem',
    fontWeight: 700,
    borderRadius: '4px',
    backgroundColor: 'rgba(99,102,241,0.15)',
    color: '#a5b4fc',
    margin: '0 auto',
  },
};

export default AdminSidebar;
