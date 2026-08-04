import React from 'react';

const FREE_SHIPPING_THRESHOLD = 499;
const SHIPPING_CHARGE = 49;

function ShippingBadge({ subtotal = 0, shippingCharge = null }) {
  const isFree =
    shippingCharge !== null
      ? shippingCharge === 0
      : subtotal >= FREE_SHIPPING_THRESHOLD;

  const amountNeeded =
    !isFree && shippingCharge === null
      ? FREE_SHIPPING_THRESHOLD - subtotal
      : 0;

  if (isFree) {
    return (
      <div className="shipping-badge shipping-badge--free" role="status" aria-label="Free shipping applied">
        <span className="shipping-badge__icon" aria-hidden="true">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M5 12l5 5L20 7"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="shipping-badge__text">
          You've got <strong>free shipping</strong>!
        </span>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="shipping-badge shipping-badge--paid" role="status" aria-label={`Shipping charge ₹${SHIPPING_CHARGE}`}>
      <span className="shipping-badge__icon" aria-hidden="true">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <rect
            x="1"
            y="3"
            width="15"
            height="13"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M16 8h4l3 4v5h-7V8z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <circle cx="5.5" cy="18.5" r="2" stroke="currentColor" strokeWidth="1.75" />
          <circle cx="19.5" cy="18.5" r="2" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      </span>
      <span className="shipping-badge__text">
        {amountNeeded > 0 ? (
          <>
            Add{' '}
            <strong>
              ₹{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amountNeeded)}
            </strong>{' '}
            more for free shipping. Shipping:{' '}
            <strong>₹{SHIPPING_CHARGE}</strong>
          </>
        ) : (
          <>
            Shipping charge: <strong>₹{SHIPPING_CHARGE}</strong>
          </>
        )}
      </span>
      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .shipping-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.4;
    width: fit-content;
  }

  .shipping-badge--free {
    background-color: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #15803d;
  }

  .shipping-badge--paid {
    background-color: #fffbeb;
    border: 1px solid #fde68a;
    color: #92400e;
  }

  .shipping-badge__icon {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .shipping-badge__text strong {
    font-weight: 700;
  }
`;

export default ShippingBadge;
