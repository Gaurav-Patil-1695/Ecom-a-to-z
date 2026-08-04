import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoSrc from '@/assets/images/logo.svg';
import searchIcon from '@/assets/icons/search.svg';
import cartIcon from '@/assets/icons/cart.svg';
import userIcon from '@/assets/icons/user.svg';
import bellIcon from '@/assets/icons/bell.svg';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const toggleAccountMenu = () => {
    setAccountMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header" style={styles.header}>
      <div className="header__inner" style={styles.inner}>
        {/* Logo */}
        <Link to="/" className="header__logo" style={styles.logoLink} aria-label="Go to home">
          <img src={logoSrc} alt="Logo" style={styles.logoImg} />
        </Link>

        {/* Search bar */}
        <form
          className="header__search"
          style={styles.searchForm}
          onSubmit={handleSearchSubmit}
          role="search"
        >
          <input
            type="text"
            className="header__search-input"
            style={styles.searchInput}
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search"
          />
          <button
            type="submit"
            className="header__search-btn"
            style={styles.searchBtn}
            aria-label="Submit search"
          >
            <img src={searchIcon} alt="" style={styles.icon} aria-hidden="true" />
          </button>
        </form>

        {/* Right-side actions */}
        <nav className="header__actions" style={styles.actions} aria-label="Header actions">
          {/* Notification bell */}
          <Link
            to="/account/notifications"
            className="header__action-btn"
            style={styles.actionBtn}
            aria-label="Notifications"
          >
            <img src={bellIcon} alt="" style={styles.icon} aria-hidden="true" />
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="header__action-btn"
            style={styles.actionBtn}
            aria-label="Shopping cart"
          >
            <img src={cartIcon} alt="" style={styles.icon} aria-hidden="true" />
          </Link>

          {/* Account menu */}
          <div
            className="header__account"
            style={styles.accountWrapper}
            ref={accountMenuRef}
          >
            <button
              type="button"
              className="header__account-toggle"
              style={styles.accountToggle}
              onClick={toggleAccountMenu}
              aria-haspopup="true"
              aria-expanded={accountMenuOpen}
              aria-label="Account menu"
            >
              <img src={userIcon} alt="" style={styles.icon} aria-hidden="true" />
              <img src={chevronDownIcon} alt="" style={styles.chevron} aria-hidden="true" />
            </button>

            {accountMenuOpen && (
              <ul
                className="header__account-menu"
                style={styles.accountMenu}
                role="menu"
              >
                <li role="none">
                  <Link
                    to="/account"
                    style={styles.menuItem}
                    role="menuitem"
                    onClick={() => setAccountMenuOpen(false)}
                  >
                    My Account
                  </Link>
                </li>
                <li role="none">
                  <Link
                    to="/account/orders"
                    style={styles.menuItem}
                    role="menuitem"
                    onClick={() => setAccountMenuOpen(false)}
                  >
                    Orders
                  </Link>
                </li>
                <li role="none">
                  <Link
                    to="/account/addresses"
                    style={styles.menuItem}
                    role="menuitem"
                    onClick={() => setAccountMenuOpen(false)}
                  >
                    Addresses
                  </Link>
                </li>
                <li role="none" style={styles.menuDivider} />
                <li role="none">
                  <Link
                    to="/auth/login"
                    style={styles.menuItem}
                    role="menuitem"
                    onClick={() => setAccountMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li role="none">
                  <Link
                    to="/auth/register"
                    style={styles.menuItem}
                    role="menuitem"
                    onClick={() => setAccountMenuOpen(false)}
                  >
                    Register
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem',
    height: '64px',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    textDecoration: 'none',
  },
  logoImg: {
    height: '36px',
    width: 'auto',
  },
  searchForm: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    overflow: 'hidden',
    maxWidth: '560px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  searchBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem 0.75rem',
    border: 'none',
    backgroundColor: '#4f46e5',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginLeft: 'auto',
    flexShrink: 0,
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    borderRadius: '6px',
    color: '#374151',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  icon: {
    width: '20px',
    height: '20px',
  },
  accountWrapper: {
    position: 'relative',
  },
  accountToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.5rem',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    borderRadius: '6px',
  },
  chevron: {
    width: '14px',
    height: '14px',
    opacity: 0.6,
  },
  accountMenu: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    right: 0,
    minWidth: '180px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    listStyle: 'none',
    margin: 0,
    padding: '0.25rem 0',
    zIndex: 200,
  },
  menuItem: {
    display: 'block',
    padding: '0.625rem 1rem',
    fontSize: '0.875rem',
    color: '#111827',
    textDecoration: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  menuDivider: {
    borderTop: '1px solid #e5e7eb',
    margin: '0.25rem 0',
  },
};

export default Header;
