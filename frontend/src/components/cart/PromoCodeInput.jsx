import React, { useState } from 'react';
import checkIcon from '@/assets/icons/check.svg';
import closeIcon from '@/assets/icons/close.svg';

const PromoCodeInput = ({ onApply, onRemove, appliedPromo }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setError('Please enter a promo code.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onApply(trimmed);
      setCode('');
    } catch (err) {
      setError(err?.message || 'Invalid or expired promo code.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setError('');
    setCode('');
    onRemove();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  if (appliedPromo) {
    return (
      <div className="promo-code promo-code--applied">
        <div className="promo-code__applied-row">
          <img
            src={checkIcon}
            alt=""
            aria-hidden="true"
            className="promo-code__check-icon"
          />
          <span className="promo-code__applied-label">
            Promo code{' '}
            <strong className="promo-code__applied-code">{appliedPromo.code}</strong>{' '}
            applied
          </span>
          {appliedPromo.discountAmount != null && (
            <span className="promo-code__applied-discount">
              -₹{Number(appliedPromo.discountAmount).toFixed(2)}
            </span>
          )}
          <button
            type="button"
            className="promo-code__remove-btn"
            onClick={handleRemove}
            aria-label={`Remove promo code ${appliedPromo.code}`}
          >
            <img src={closeIcon} alt="" aria-hidden="true" />
            <span className="promo-code__remove-label">Remove</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="promo-code">
      <label htmlFor="promo-code-input" className="promo-code__label">
        Promo Code
      </label>
      <div className="promo-code__input-row">
        <input
          id="promo-code-input"
          type="text"
          className={`promo-code__input${error ? ' promo-code__input--error' : ''}`}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter promo code"
          disabled={loading}
          autoComplete="off"
          aria-describedby={error ? 'promo-code-error' : undefined}
          aria-invalid={!!error}
        />
        <button
          type="button"
          className="promo-code__apply-btn"
          onClick={handleApply}
          disabled={loading || !code.trim()}
        >
          {loading ? 'Applying…' : 'Apply'}
        </button>
      </div>
      {error && (
        <p id="promo-code-error" className="promo-code__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default PromoCodeInput;
