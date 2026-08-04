import React, { useState } from 'react';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

function OrderSummaryPanel({
  items = [],
  subtotal = 0,
  discount = 0,
  shippingCharge = 0,
  tax = 0,
  total = 0,
  promoCode = null,
  promoDiscount = 0,
  collapsed = false,
}) {
  const [isExpanded, setIsExpanded] = useState(!collapsed);

  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <aside className="order-summary-panel" aria-label="Order summary">
      <button
        type="button"
        className="order-summary-panel__toggle"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        aria-controls="order-summary-panel__body"
      >
        <span className="order-summary-panel__toggle-label">
          <svg
            className="order-summary-panel__bag-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="3"
              y1="6"
              x2="21"
              y2="6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M16 10a4 4 0 01-8 0"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>
            {isExpanded ? 'Hide' : 'Show'} order summary
            <span className="order-summary-panel__item-count"> ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          </span>
        </span>
        <span className="order-summary-panel__toggle-total">
          {formatCurrency(total)}
          <svg
            className={`order-summary-panel__chevron${isExpanded ? ' order-summary-panel__chevron--up' : ''}`}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
            focusable="false"
          >
            <polyline
              points="3,6 8,11 13,6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div
        id="order-summary-panel__body"
        className={`order-summary-panel__body${isExpanded ? ' order-summary-panel__body--expanded' : ''}`}
        aria-hidden={!isExpanded}
      >
        {items.length > 0 && (
          <ul className="order-summary-panel__items" aria-label="Cart items">
            {items.map((item) => (
              <li key={item.id || item.cartItemId || item.skuId} className="order-summary-panel__item">
                <div className="order-summary-panel__item-image-wrap">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name || 'Product image'}
                      className="order-summary-panel__item-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="order-summary-panel__item-image-placeholder" aria-hidden="true" />
                  )}
                  {item.quantity > 1 && (
                    <span className="order-summary-panel__item-qty" aria-label={`Quantity: ${item.quantity}`}>
                      {item.quantity}
                    </span>
                  )}
                </div>
                <div className="order-summary-panel__item-details">
                  <span className="order-summary-panel__item-name">{item.name}</span>
                  {item.variant && (
                    <span className="order-summary-panel__item-variant">{item.variant}</span>
                  )}
                </div>
                <span className="order-summary-panel__item-price">
                  {formatCurrency((item.price || 0) * (item.quantity || 1))}
                </span>
              </li>
            ))}
          </ul>
        )}

        <dl className="order-summary-panel__totals">
          <div className="order-summary-panel__totals-row">
            <dt>Subtotal</dt>
            <dd>{formatCurrency(subtotal)}</dd>
          </div>

          {discount > 0 && (
            <div className="order-summary-panel__totals-row order-summary-panel__totals-row--discount">
              <dt>Discount</dt>
              <dd>-{formatCurrency(discount)}</dd>
            </div>
          )}

          {promoCode && promoDiscount > 0 && (
            <div className="order-summary-panel__totals-row order-summary-panel__totals-row--promo">
              <dt>
                Promo{' '}
                <span className="order-summary-panel__promo-badge">{promoCode}</span>
              </dt>
              <dd>-{formatCurrency(promoDiscount)}</dd>
            </div>
          )}

          <div className="order-summary-panel__totals-row">
            <dt>Shipping</dt>
            <dd>
              {shippingCharge === 0 ? (
                <span className="order-summary-panel__free-shipping">Free</span>
              ) : (
                formatCurrency(shippingCharge)
              )}
            </dd>
          </div>

          {tax > 0 && (
            <div className="order-summary-panel__totals-row">
              <dt>Tax</dt>
              <dd>{formatCurrency(tax)}</dd>
            </div>
          )}

          <div className="order-summary-panel__totals-row order-summary-panel__totals-row--total">
            <dt>Total</dt>
            <dd>{formatCurrency(total)}</dd>
          </div>
        </dl>
      </div>

      <style>{`
        .order-summary-panel {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          overflow: hidden;
          font-size: 0.9375rem;
          color: #111827;
        }

        .order-summary-panel__toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 1rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9375rem;
          color: #2563eb;
          font-weight: 600;
          gap: 0.5rem;
          text-align: left;
        }

        .order-summary-panel__toggle:focus-visible {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }

        .order-summary-panel__toggle-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .order-summary-panel__bag-icon {
          flex-shrink: 0;
          color: #2563eb;
        }

        .order-summary-panel__item-count {
          font-weight: 400;
          color: #6b7280;
        }

        .order-summary-panel__toggle-total {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          color: #111827;
          font-weight: 700;
          white-space: nowrap;
        }

        .order-summary-panel__chevron {
          transition: transform 0.2s ease;
          flex-shrink: 0;
          color: #6b7280;
        }

        .order-summary-panel__chevron--up {
          transform: rotate(180deg);
        }

        .order-summary-panel__body {
          display: none;
          padding: 0 1rem 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .order-summary-panel__body--expanded {
          display: block;
        }

        .order-summary-panel__items {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          padding-top: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .order-summary-panel__item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .order-summary-panel__item-image-wrap {
          position: relative;
          flex-shrink: 0;
          width: 3rem;
          height: 3rem;
          border-radius: 0.375rem;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          background-color: #f3f4f6;
        }

        .order-summary-panel__item-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .order-summary-panel__item-image-placeholder {
          width: 100%;
          height: 100%;
          background-color: #e5e7eb;
        }

        .order-summary-panel__item-qty {
          position: absolute;
          top: -0.375rem;
          right: -0.375rem;
          background-color: #6b7280;
          color: #ffffff;
          font-size: 0.6875rem;
          font-weight: 700;
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .order-summary-panel__item-details {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .order-summary-panel__item-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .order-summary-panel__item-variant {
          font-size: 0.8125rem;
          color: #6b7280;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .order-summary-panel__item-price {
          font-size: 0.875rem;
          font-weight: 600;
          color: #111827;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .order-summary-panel__totals {
          margin: 0;
          padding-top: 0.875rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .order-summary-panel__totals-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 0.9375rem;
          color: #374151;
        }

        .order-summary-panel__totals-row dt {
          font-weight: 400;
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .order-summary-panel__totals-row dd {
          font-weight: 500;
          margin: 0;
        }

        .order-summary-panel__totals-row--discount dd,
        .order-summary-panel__totals-row--promo dd {
          color: #16a34a;
        }

        .order-summary-panel__totals-row--total {
          border-top: 1px solid #e5e7eb;
          padding-top: 0.625rem;
          margin-top: 0.25rem;
          font-size: 1rem;
          color: #111827;
        }

        .order-summary-panel__totals-row--total dt,
        .order-summary-panel__totals-row--total dd {
          font-weight: 700;
        }

        .order-summary-panel__free-shipping {
          color: #16a34a;
          font-weight: 600;
        }

        .order-summary-panel__promo-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.125rem 0.375rem;
          background-color: #dcfce7;
          color: #15803d;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.025em;
          text-transform: uppercase;
        }
      `}</style>
    </aside>
  );
}

export default OrderSummaryPanel;
