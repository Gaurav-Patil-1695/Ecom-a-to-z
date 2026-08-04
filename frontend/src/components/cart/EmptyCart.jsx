import React from 'react';
import { Link } from 'react-router-dom';
import emptyStateImage from '@/assets/images/empty-state.svg';

const EmptyCart = () => {
  return (
    <div className="empty-cart">
      <div className="empty-cart__illustration-wrapper">
        <img
          src={emptyStateImage}
          alt="Your cart is empty"
          className="empty-cart__illustration"
        />
      </div>
      <h2 className="empty-cart__title">Your cart is empty</h2>
      <p className="empty-cart__message">
        Looks like you haven't added anything to your cart yet.
      </p>
      <Link to="/products" className="empty-cart__cta">
        Browse Products
      </Link>
    </div>
  );
};

export default EmptyCart;
