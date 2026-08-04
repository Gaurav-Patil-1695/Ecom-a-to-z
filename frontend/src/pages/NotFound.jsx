import { Link } from 'react-router-dom';
import logoSvg from '@/assets/images/logo.svg';
import emptyStateImg from '@/assets/images/empty-state.svg';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8f9fa',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e9ecef',
          boxShadow: '0 1px 4px rgba(33,37,41,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            height: '64px',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
            }}
            aria-label="ShopMini Home"
          >
            <img src={logoSvg} alt="ShopMini" style={{ height: '32px', width: 'auto' }} />
            <span
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#4c6ef5',
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
              }}
            >
              ShopMini
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main
        id="main-content"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '24px',
          }}
        >
          <img
            src={emptyStateImg}
            alt="Page not found illustration"
            style={{ width: '200px', height: 'auto' }}
            aria-hidden="false"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p
              style={{
                margin: 0,
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#4c6ef5',
              }}
            >
              404 Error
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: '32px',
                fontWeight: '700',
                color: '#212529',
                letterSpacing: '-0.02em',
                lineHeight: '40px',
              }}
            >
              Page Not Found
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '400',
                color: '#495057',
                lineHeight: '24px',
              }}
            >
              Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
            }}
          >
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '44px',
                padding: '10px 24px',
                background: '#4c6ef5',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#3b5bdb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#4c6ef5';
              }}
            >
              Go to Home
            </Link>
            <Link
              to="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '44px',
                padding: '10px 24px',
                background: 'transparent',
                color: '#4c6ef5',
                border: '1.5px solid #4c6ef5',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e8ecfd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Browse Products
            </Link>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              justifyContent: 'center',
              marginTop: '8px',
            }}
          >
            {[
              { label: 'My Orders', to: '/orders' },
              { label: 'My Account', to: '/account' },
              { label: 'Cart', to: '/cart' },
              { label: 'Contact Us', to: '/contact' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontSize: '14px',
                  color: '#4c6ef5',
                  textDecoration: 'none',
                  fontWeight: '400',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e8ecfd';
                  e.currentTarget.style.color = '#3b5bdb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#4c6ef5';
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          background: '#212529',
          color: '#adb5bd',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '12px',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          &copy; ShopMini. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
