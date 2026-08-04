import React from 'react';
import { Link } from 'react-router-dom';
import logoSrc from '@/assets/images/logo.svg';

const Footer = () => {
  const currentYear = 2024;

  return (
    <footer className="footer" style={styles.footer}>
      <div className="footer__inner" style={styles.inner}>
        {/* Brand column */}
        <div className="footer__brand" style={styles.brandCol}>
          <Link to="/" style={styles.logoLink} aria-label="Go to home">
            <img src={logoSrc} alt="Logo" style={styles.logoImg} />
          </Link>
          <p style={styles.tagline}>
            Your one-stop shop for quality products, delivered fast.
          </p>
        </div>

        {/* Shop links */}
        <div className="footer__col" style={styles.col}>
          <h3 style={styles.colHeading}>Shop</h3>
          <ul style={styles.linkList}>
            <li>
              <Link to="/products" style={styles.link}>All Products</Link>
            </li>
            <li>
              <Link to="/categories" style={styles.link}>Categories</Link>
            </li>
            <li>
              <Link to="/search" style={styles.link}>Search</Link>
            </li>
          </ul>
        </div>

        {/* Account links */}
        <div className="footer__col" style={styles.col}>
          <h3 style={styles.colHeading}>Account</h3>
          <ul style={styles.linkList}>
            <li>
              <Link to="/account" style={styles.link}>My Account</Link>
            </li>
            <li>
              <Link to="/account/orders" style={styles.link}>Orders</Link>
            </li>
            <li>
              <Link to="/account/addresses" style={styles.link}>Addresses</Link>
            </li>
            <li>
              <Link to="/account/notifications" style={styles.link}>Notifications</Link>
            </li>
          </ul>
        </div>

        {/* Help links */}
        <div className="footer__col" style={styles.col}>
          <h3 style={styles.colHeading}>Help</h3>
          <ul style={styles.linkList}>
            <li>
              <Link to="/auth/login" style={styles.link}>Login</Link>
            </li>
            <li>
              <Link to="/auth/register" style={styles.link}>Register</Link>
            </li>
            <li>
              <Link to="/auth/forgot-password" style={styles.link}>Forgot Password</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom" style={styles.bottom}>
        <p style={styles.copyright}>
          &copy; {currentYear} MyStore. All rights reserved.
        </p>
        <nav aria-label="Legal links" style={styles.legalNav}>
          <Link to="/privacy" style={styles.legalLink}>Privacy Policy</Link>
          <span style={styles.legalSeparator} aria-hidden="true">·</span>
          <Link to="/terms" style={styles.legalLink}>Terms of Service</Link>
          <span style={styles.legalSeparator} aria-hidden="true">·</span>
          <Link to="/returns" style={styles.legalLink}>Returns Policy</Link>
        </nav>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#111827',
    color: '#d1d5db',
    marginTop: 'auto',
  },
  inner: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '2rem',
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '3rem 1rem 2rem',
  },
  brandCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  logoLink: {
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  logoImg: {
    height: '32px',
    width: 'auto',
    filter: 'brightness(0) invert(1)',
  },
  tagline: {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    color: '#9ca3af',
    margin: 0,
    maxWidth: '240px',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  colHeading: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#f9fafb',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  linkList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  link: {
    fontSize: '0.875rem',
    color: '#9ca3af',
    textDecoration: 'none',
    transition: 'color 0.15s',
  },
  bottom: {
    borderTop: '1px solid #1f2937',
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '1.25rem 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  copyright: {
    fontSize: '0.8125rem',
    color: '#6b7280',
    margin: 0,
  },
  legalNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  legalLink: {
    fontSize: '0.8125rem',
    color: '#6b7280',
    textDecoration: 'none',
    transition: 'color 0.15s',
  },
  legalSeparator: {
    color: '#4b5563',
    fontSize: '0.8125rem',
  },
};

export default Footer;
