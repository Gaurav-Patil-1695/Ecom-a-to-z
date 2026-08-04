import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import cartIcon from '@/assets/icons/cart.svg';
import trashIcon from '@/assets/icons/trash.svg';
import plusIcon from '@/assets/icons/plus.svg';
import minusIcon from '@/assets/icons/minus.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

function getCartId() {
  return localStorage.getItem('cartId');
}

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || 'Request failed'), { status: res.status, data });
  return data;
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);
  return { toasts, addToast };
}

function Toast({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map(t => (
        <div
          key={t.id}
          role="status"
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            backgroundColor: t.type === 'error' ? '#f03e3e' : t.type === 'success' ? '#37b24d' : '#4c6ef5',
            color: '#ffffff',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '14px',
            lineHeight: '20px',
            boxShadow: '0 4px 12px rgba(33,37,41,0.18)',
            maxWidth: '320px',
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

function SkeletonRow() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        padding: '20px 24px',
        borderBottom: '1px solid #868e96',
        alignItems: 'flex-start',
      }}
      aria-hidden="true"
    >
      <div style={{ width: '96px', height: '96px', borderRadius: '10px', backgroundColor: '#e9ecef', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ height: '16px', borderRadius: '6px', backgroundColor: '#e9ecef', width: '60%' }} />
        <div style={{ height: '14px', borderRadius: '6px', backgroundColor: '#e9ecef', width: '40%' }} />
        <div style={{ height: '14px', borderRadius: '6px', backgroundColor: '#e9ecef', width: '30%' }} />
      </div>
      <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
        <div style={{ height: '16px', borderRadius: '6px', backgroundColor: '#e9ecef', width: '100%' }} />
        <div style={{ height: '32px', borderRadius: '6px', backgroundColor: '#e9ecef', width: '100%' }} />
      </div>
    </div>
  );
}

function SkeletonSummary() {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #868e96',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
      aria-hidden="true"
    >
      {[80, 60, 70, 90, 50].map((w, i) => (
        <div key={i} style={{ height: '16px', borderRadius: '6px', backgroundColor: '#e9ecef', width: `${w}%` }} />
      ))}
      <div style={{ height: '44px', borderRadius: '10px', backgroundColor: '#e9ecef', marginTop: '8px' }} />
    </div>
  );
}

function EmptyCart() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
        gap: '16px',
      }}
      role="status"
    >
      <img src={cartIcon} alt="" aria-hidden="true" style={{ width: '64px', height: '64px', opacity: 0.4 }} />
      <h2
        style={{
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '24px',
          fontWeight: '700',
          letterSpacing: '-0.01em',
          lineHeight: '32px',
          color: '#212529',
          margin: 0,
        }}
      >
        Your cart is empty
      </h2>
      <p
        style={{
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '16px',
          fontWeight: '400',
          lineHeight: '24px',
          color: '#495057',
          margin: 0,
          maxWidth: '360px',
        }}
      >
        Looks like you haven't added anything yet. Browse our products and find something you love.
      </p>
      <Link
        to="/products"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '44px',
          padding: '12px 24px',
          borderRadius: '10px',
          backgroundColor: '#4c6ef5',
          color: '#ffffff',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '16px',
          fontWeight: '600',
          textDecoration: 'none',
          marginTop: '8px',
        }}
      >
        Start shopping
      </Link>
    </div>
  );
}

function ErrorPanel({ onRetry }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
        gap: '16px',
      }}
      role="alert"
    >
      <span style={{ fontSize: '48px' }} aria-hidden="true">⚠️</span>
      <h2
        style={{
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '24px',
          fontWeight: '700',
          letterSpacing: '-0.01em',
          lineHeight: '32px',
          color: '#212529',
          margin: 0,
        }}
      >
        Couldn't load your cart
      </h2>
      <p
        style={{
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '16px',
          fontWeight: '400',
          lineHeight: '24px',
          color: '#495057',
          margin: 0,
        }}
      >
        Please refresh the page.
      </p>
      <button
        onClick={onRetry}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '44px',
          padding: '12px 24px',
          borderRadius: '10px',
          backgroundColor: '#4c6ef5',
          color: '#ffffff',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '16px',
          fontWeight: '600',
          border: 'none',
          cursor: 'pointer',
          marginTop: '8px',
        }}
      >
        Refresh
      </button>
    </div>
  );
}

function PromoCodeForm({ cartId, onPromoApplied, addToast }) {
  const [code, setCode] = useState('');
  const [applying, setApplying] = useState(false);
  const [promoError, setPromoError] = useState('');

  async function handleApply(e) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    setApplying(true);
    setPromoError('');
    try {
      const result = await apiFetch(`/carts/${cartId}/promo`, {
        method: 'POST',
        body: JSON.stringify({ promo_code: trimmed }),
      });
      addToast('Promo code applied!', 'success');
      onPromoApplied(result);
      setCode('');
    } catch (err) {
      const msg = err.data?.message || 'Invalid or expired promo code.';
      setPromoError(msg);
      addToast(msg, 'error');
    } finally {
      setApplying(false);
    }
  }

  return (
    <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label
        htmlFor="promo-code"
        style={{
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '0.06em',
          lineHeight: '16px',
          textTransform: 'uppercase',
          color: '#495057',
        }}
      >
        Promo Code
      </label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          id="promo-code"
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Enter code"
          disabled={applying}
          style={{
            flex: 1,
            height: '44px',
            padding: '0 12px',
            border: `1px solid ${promoError ? '#f03e3e' : '#868e96'}`,
            borderRadius: '6px',
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            fontSize: '14px',
            color: '#212529',
            backgroundColor: applying ? '#e9ecef' : '#ffffff',
            outline: 'none',
          }}
          aria-describedby={promoError ? 'promo-error' : undefined}
        />
        <button
          type="submit"
          disabled={applying || !code.trim()}
          style={{
            height: '44px',
            padding: '0 16px',
            borderRadius: '6px',
            backgroundColor: applying || !code.trim() ? '#e9ecef' : '#4c6ef5',
            color: applying || !code.trim() ? '#adb5bd' : '#ffffff',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            cursor: applying || !code.trim() ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {applying ? 'Applying…' : 'Apply'}
        </button>
      </div>
      {promoError && (
        <p
          id="promo-error"
          role="alert"
          style={{
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '12px',
            lineHeight: '16px',
            color: '#f03e3e',
            margin: 0,
          }}
        >
          {promoError}
        </p>
      )}
    </form>
  );
}

function CartItemRow({ item, cartId, onUpdate, onRemove, addToast }) {
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);

  const product = item.product || {};
  const sku = item.sku || {};
  const imageUrl = product.images?.[0]?.url || placeholderProduct;
  const productName = product.name || sku.name || 'Product';
  const variantLabel = sku.variant_label || sku.attributes_label || '';
  const unitPrice = parseFloat(item.unit_price || sku.price || 0);
  const lineTotal = unitPrice * item.quantity;

  async function handleQuantityChange(newQty) {
    if (newQty < 0) return;
    setUpdating(true);
    try {
      if (newQty === 0) {
        await apiFetch(`/carts/${cartId}/items/${item.id}`, { method: 'DELETE' });
        onRemove(item.id);
        addToast('Item removed from cart', 'success');
      } else {
        const updated = await apiFetch(`/carts/${cartId}/items/${item.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ quantity: newQty }),
        });
        onUpdate(updated);
      }
    } catch (err) {
      addToast(err.data?.message || 'Failed to update quantity.', 'error');
    } finally {
      setUpdating(false);
    }
  }

  async function handleRemove() {
    setRemoving(true);
    try {
      await apiFetch(`/carts/${cartId}/items/${item.id}`, { method: 'DELETE' });
      onRemove(item.id);
      addToast('Item removed from cart', 'success');
    } catch (err) {
      addToast(err.data?.message || 'Failed to remove item.', 'error');
    } finally {
      setRemoving(false);
    }
  }

  const isDisabled = updating || removing;

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        padding: '20px 0',
        borderBottom: '1px solid #868e96',
        alignItems: 'flex-start',
        opacity: isDisabled ? 0.6 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      <Link to={`/products/${product.id || product.slug || ''}`} style={{ flexShrink: 0 }}>
        <img
          src={imageUrl}
          alt={productName}
          onError={e => { e.currentTarget.src = placeholderProduct; }}
          style={{
            width: '96px',
            height: '96px',
            objectFit: 'cover',
            borderRadius: '10px',
            display: 'block',
            border: '1px solid #868e96',
          }}
        />
      </Link>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <Link
          to={`/products/${product.id || product.slug || ''}`}
          style={{
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '16px',
            fontWeight: '600',
            lineHeight: '24px',
            color: '#212529',
            textDecoration: 'none',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {productName}
        </Link>

        {variantLabel && (
          <span
            style={{
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '14px',
              fontWeight: '400',
              lineHeight: '20px',
              color: '#495057',
            }}
          >
            {variantLabel}
          </span>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isDisabled || item.quantity <= 1}
            aria-label="Decrease quantity"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: '1px solid #868e96',
              backgroundColor: isDisabled || item.quantity <= 1 ? '#e9ecef' : '#ffffff',
              cursor: isDisabled || item.quantity <= 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            <img src={minusIcon} alt="" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
          </button>

          <span
            aria-label={`Quantity: ${item.quantity}`}
            style={{
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '16px',
              fontWeight: '600',
              lineHeight: '24px',
              color: '#212529',
              minWidth: '28px',
              textAlign: 'center',
            }}
          >
            {item.quantity}
          </span>

          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isDisabled}
            aria-label="Increase quantity"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: '1px solid #868e96',
              backgroundColor: isDisabled ? '#e9ecef' : '#ffffff',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            <img src={plusIcon} alt="" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

        <button
          onClick={handleRemove}
          disabled={isDisabled}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '14px',
            fontWeight: '400',
            lineHeight: '20px',
            color: '#f03e3e',
            padding: '4px 0',
            alignSelf: 'flex-start',
          }}
        >
          <img src={trashIcon} alt="" aria-hidden="true" style={{ width: '14px', height: '14px' }} />
          Remove
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '4px',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '16px',
            fontWeight: '700',
            lineHeight: '24px',
            color: '#212529',
          }}
        >
          ₹{lineTotal.toFixed(2)}
        </span>
        {item.quantity > 1 && (
          <span
            style={{
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '12px',
              fontWeight: '400',
              lineHeight: '16px',
              color: '#495057',
            }}
          >
            ₹{unitPrice.toFixed(2)} each
          </span>
        )}
      </div>
    </div>
  );
}

function OrderSummary({ cart, cartId, onPromoApplied, addToast, onCheckout, checkingOut }) {
  const subtotal = parseFloat(cart.subtotal || 0);
  const discount = parseFloat(cart.discount || 0);
  const deliveryFee = parseFloat(cart.delivery_fee || 0);
  const tax = parseFloat(cart.tax || 0);
  const total = parseFloat(cart.total || subtotal - discount + deliveryFee + tax);
  const promoCode = cart.promo_code || null;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #868e96',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        position: 'sticky',
        top: '24px',
      }}
    >
      <h2
        style={{
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '20px',
          fontWeight: '600',
          lineHeight: '28px',
          color: '#212529',
          margin: '0 0 16px 0',
        }}
      >
        Order Summary
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '14px',
              fontWeight: '400',
              lineHeight: '20px',
              color: '#495057',
            }}
          >
            Subtotal
          </span>
          <span
            style={{
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '14px',
              fontWeight: '500',
              lineHeight: '20px',
              color: '#212529',
            }}
          >
            ₹{subtotal.toFixed(2)}
          </span>
        </div>

        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                fontSize: '14px',
                fontWeight: '400',
                lineHeight: '20px',
                color: '#37b24d',
              }}
            >
              Discount{promoCode ? ` (${promoCode})` : ''}
            </span>
            <span
              style={{
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                fontSize: '14px',
                fontWeight: '500',
                lineHeight: '20px',
                color: '#37b24d',
              }}
            >
              −₹{discount.toFixed(2)}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '14px',
              fontWeight: '400',
              lineHeight: '20px',
              color: '#495057',
            }}
          >
            Delivery
          </span>
          <span
            style={{
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '14px',
              fontWeight: '500',
              lineHeight: '20px',
              color: deliveryFee === 0 ? '#37b24d' : '#212529',
            }}
          >
            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
          </span>
        </div>

        {tax > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                fontSize: '14px',
                fontWeight: '400',
                lineHeight: '20px',
                color: '#495057',
              }}
            >
              Tax
            </span>
            <span
              style={{
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                fontSize: '14px',
                fontWeight: '500',
                lineHeight: '20px',
                color: '#212529',
              }}
            >
              ₹{tax.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div
        style={{
          borderTop: '1px solid #868e96',
          paddingTop: '16px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '16px',
            fontWeight: '700',
            lineHeight: '24px',
            color: '#212529',
          }}
        >
          Total
        </span>
        <span
          style={{
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '20px',
            fontWeight: '700',
            lineHeight: '28px',
            color: '#212529',
          }}
        >
          ₹{total.toFixed(2)}
        </span>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <PromoCodeForm cartId={cartId} onPromoApplied={onPromoApplied} addToast={addToast} />
      </div>

      <button
        onClick={onCheckout}
        disabled={checkingOut}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '44px',
          borderRadius: '10px',
          backgroundColor: checkingOut ? '#e9ecef' : '#4c6ef5',
          color: checkingOut ? '#adb5bd' : '#ffffff',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '16px',
          fontWeight: '600',
          border: 'none',
          cursor: checkingOut ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.15s',
        }}
        aria-busy={checkingOut}
      >
        {checkingOut ? 'Processing…' : 'Proceed to Checkout'}
      </button>
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const { toasts, addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [checkingOut, setCheckingOut] = useState(false);

  const cartId = getCartId();

  const fetchCart = useCallback(async () => {
    if (!cartId) {
      setLoading(false);
      setCart({ items: [] });
      setItems([]);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const data = await apiFetch(`/carts/${cartId}`);
      setCart(data);
      setItems(data.items || []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [cartId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  function handleItemUpdate(updatedItem) {
    setItems(prev => prev.map(it => (it.id === updatedItem.id ? updatedItem : it)));
    setCart(prev => prev ? { ...prev, items: prev.items?.map(it => it.id === updatedItem.id ? updatedItem : it) } : prev);
  }

  function handleItemRemove(itemId) {
    setItems(prev => prev.filter(it => it.id !== itemId));
    setCart(prev => prev ? { ...prev, items: prev.items?.filter(it => it.id !== itemId) } : prev);
  }

  function handlePromoApplied(updatedCart) {
    setCart(updatedCart);
    setItems(updatedCart.items || items);
  }

  async function handleCheckout() {
    if (!cartId) return;
    setCheckingOut(true);
    try {
      await apiFetch('/checkout/review', {
        method: 'GET',
      });
      navigate('/checkout');
    } catch (err) {
      navigate('/checkout');
    } finally {
      setCheckingOut(false);
    }
  }

  const itemCount = items.reduce((sum, it) => sum + (it.quantity || 0), 0);

  return (
    <>
      <main
        style={{
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '40px 24px 64px',
          }}
        >
          <h1
            style={{
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '24px',
              fontWeight: '700',
              letterSpacing: '-0.01em',
              lineHeight: '32px',
              color: '#212529',
              margin: '0 0 24px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            Your cart
            {!loading && !error && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#e8ecfd',
                  color: '#4c6ef5',
                  fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  lineHeight: '16px',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  verticalAlign: 'middle',
                }}
                aria-label={`${itemCount} items`}
              >
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </h1>

          {loading && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr) 340px',
                gap: '32px',
                alignItems: 'start',
              }}
            >
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #868e96',
                  overflow: 'hidden',
                  padding: '0 24px',
                }}
                aria-busy="true"
                aria-label="Loading cart items"
              >
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </div>
              <SkeletonSummary />
            </div>
          )}

          {!loading && error && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #868e96',
              }}
            >
              <ErrorPanel onRetry={fetchCart} />
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #868e96',
              }}
            >
              <EmptyCart />
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr) 340px',
                gap: '32px',
                alignItems: 'start',
              }}
            >
              <section
                aria-label="Cart items"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #868e96',
                  padding: '0 24px',
                }}
              >
                {items.map(item => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    cartId={cartId}
                    onUpdate={handleItemUpdate}
                    onRemove={handleItemRemove}
                    addToast={addToast}
                  />
                ))}

                <div
                  style={{
                    padding: '16px 0',
                    display: 'flex',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Link
                    to="/products"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: '14px',
                      fontWeight: '500',
                      lineHeight: '20px',
                      color: '#4c6ef5',
                      textDecoration: 'none',
                      minHeight: '44px',
                    }}
                  >
                    ← Continue shopping
                  </Link>
                </div>
              </section>

              <aside aria-label="Order summary">
                {cart && (
                  <OrderSummary
                    cart={cart}
                    cartId={cartId}
                    onPromoApplied={handlePromoApplied}
                    addToast={addToast}
                    onCheckout={handleCheckout}
                    checkingOut={checkingOut}
                  />
                )}
              </aside>
            </div>
          )}
        </div>
      </main>

      <Toast toasts={toasts} />
    </>
  );
}
