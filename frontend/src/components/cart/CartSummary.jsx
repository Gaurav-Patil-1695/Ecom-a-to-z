import React from 'react';

const CartSummary = ({ summary }) => {
  const {
    subtotal = 0,
    shippingCharge = 0,
    discount = 0,
    gst = 0,
    grandTotal = 0,
  } = summary || {};

  const formatAmount = (amount) =>
    `₹${Number(amount).toFixed(2)}`;

  return (
    <div className="cart-summary">
      <h2 className="cart-summary__title">Order Summary</h2>

      <div className="cart-summary__rows">
        <div className="cart-summary__row">
          <span className="cart-summary__label">Subtotal</span>
          <span className="cart-summary__value">{formatAmount(subtotal)}</span>
        </div>

        <div className="cart-summary__row">
          <span className="cart-summary__label">Shipping</span>
          <span className="cart-summary__value">
            {Number(shippingCharge) === 0 ? (
              <span className="cart-summary__free">Free</span>
            ) : (
              formatAmount(shippingCharge)
            )}
          </span>
        </div>

        {Number(discount) > 0 && (
          <div className="cart-summary__row cart-summary__row--discount">
            <span className="cart-summary__label">Discount</span>
            <span className="cart-summary__value cart-summary__value--discount">
              -{formatAmount(discount)}
            </span>
          </div>
        )}

        <div className="cart-summary__row">
          <span className="cart-summary__label">GST</span>
          <span className="cart-summary__value">{formatAmount(gst)}</span>
        </div>

        <div className="cart-summary__divider" role="separator" />

        <div className="cart-summary__row cart-summary__row--total">
          <span className="cart-summary__label cart-summary__label--total">Grand Total</span>
          <span className="cart-summary__value cart-summary__value--total">
            {formatAmount(grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
