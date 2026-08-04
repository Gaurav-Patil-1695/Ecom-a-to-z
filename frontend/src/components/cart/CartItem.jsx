import React from 'react';
import trashIcon from '@/assets/icons/trash.svg';
import plusIcon from '@/assets/icons/plus.svg';
import minusIcon from '@/assets/icons/minus.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

const CartItem = ({ item, onUpdateQty, onRemove }) => {
  const {
    id,
    name,
    sku,
    variantLabel,
    imageUrl,
    price,
    quantity,
    maxQuantity,
  } = item;

  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdateQty(id, quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (maxQuantity == null || quantity < maxQuantity) {
      onUpdateQty(id, quantity + 1);
    }
  };

  const handleRemove = () => {
    onRemove(id);
  };

  const lineTotal = (price * quantity).toFixed(2);

  return (
    <div className="cart-item">
      <div className="cart-item__image-wrapper">
        <img
          src={imageUrl || placeholderProduct}
          alt={name}
          className="cart-item__image"
          onError={(e) => {
            e.currentTarget.src = placeholderProduct;
          }}
        />
      </div>

      <div className="cart-item__details">
        <p className="cart-item__name">{name}</p>
        {sku && (
          <p className="cart-item__sku">SKU: {sku}</p>
        )}
        {variantLabel && (
          <p className="cart-item__variant">{variantLabel}</p>
        )}
        <p className="cart-item__price">₹{Number(price).toFixed(2)} each</p>
      </div>

      <div className="cart-item__controls">
        <div className="cart-item__qty-stepper">
          <button
            type="button"
            className="cart-item__qty-btn cart-item__qty-btn--minus"
            onClick={handleDecrement}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <img src={minusIcon} alt="" aria-hidden="true" />
          </button>

          <span className="cart-item__qty-value" aria-label={`Quantity: ${quantity}`}>
            {quantity}
          </span>

          <button
            type="button"
            className="cart-item__qty-btn cart-item__qty-btn--plus"
            onClick={handleIncrement}
            disabled={maxQuantity != null && quantity >= maxQuantity}
            aria-label="Increase quantity"
          >
            <img src={plusIcon} alt="" aria-hidden="true" />
          </button>
        </div>

        <p className="cart-item__line-total">₹{lineTotal}</p>

        <button
          type="button"
          className="cart-item__remove-btn"
          onClick={handleRemove}
          aria-label={`Remove ${name} from cart`}
        >
          <img src={trashIcon} alt="" aria-hidden="true" />
          <span className="cart-item__remove-label">Remove</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
