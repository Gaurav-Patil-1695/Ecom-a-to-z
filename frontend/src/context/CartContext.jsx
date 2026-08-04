import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const GUEST_CART_KEY = 'guest_cart_id';
const CART_KEY = 'cart_id';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function apiFetch(path, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    let errBody = null;
    try {
      errBody = await res.json();
    } catch {
      // ignore
    }
    const err = new Error(
      (errBody && (errBody.message || errBody.error)) || `HTTP ${res.status}`
    );
    err.status = res.status;
    err.body = errBody;
    throw err;
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export function CartProvider({ children }) {
  const { token, isAuthenticated, isGuest } = useAuth();

  const [cartId, setCartId] = useState(() => {
    try {
      return localStorage.getItem(CART_KEY) || null;
    } catch {
      return null;
    }
  });

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mergeInProgress = useRef(false);

  // Persist cartId to localStorage
  const persistCartId = useCallback((id) => {
    try {
      if (id) {
        localStorage.setItem(CART_KEY, id);
      } else {
        localStorage.removeItem(CART_KEY);
      }
    } catch {
      // ignore
    }
    setCartId(id);
  }, []);

  const getGuestCartId = useCallback(() => {
    try {
      return localStorage.getItem(GUEST_CART_KEY) || null;
    } catch {
      return null;
    }
  }, []);

  const setGuestCartId = useCallback((id) => {
    try {
      if (id) {
        localStorage.setItem(GUEST_CART_KEY, id);
      } else {
        localStorage.removeItem(GUEST_CART_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch the cart by id
  const fetchCart = useCallback(
    async (id) => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch(`/carts/${id}`, {}, token);
        setCart(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch cart');
        if (err.status === 404) {
          persistCartId(null);
          setCart(null);
        }
      } finally {
        setLoading(false);
      }
    },
    [token, persistCartId]
  );

  // Create a new cart (guest) — backend returns { id, items, ... }
  const createCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // The backend expects a POST to /carts but the naming contract
      // only exposes /carts/{cartId}/* routes.  We derive the cart id
      // from a POST /carts endpoint if available, otherwise fall back
      // to the guest-register flow.  Here we POST to /carts.
      const data = await apiFetch('/carts', { method: 'POST' }, token);
      const id = data?.id || data?.cartId;
      if (id) {
        persistCartId(id);
        if (!isAuthenticated || isGuest) {
          setGuestCartId(id);
        }
        setCart(data);
      }
      return id;
    } catch (err) {
      setError(err.message || 'Failed to create cart');
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated, isGuest, persistCartId, setGuestCartId]);

  // Ensure we have a cart; create one if not.
  const ensureCart = useCallback(async () => {
    if (cartId) return cartId;
    return createCart();
  }, [cartId, createCart]);

  // Add an item to the cart
  const addItem = useCallback(
    async ({ skuId, quantity }) => {
      const id = await ensureCart();
      if (!id) return null;
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch(
          `/carts/${id}/items`,
          {
            method: 'POST',
            body: JSON.stringify({ skuId, quantity }),
          },
          token
        );
        setCart(data);
        return data;
      } catch (err) {
        setError(err.message || 'Failed to add item');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [ensureCart, token]
  );

  // Update an item's quantity
  const updateItem = useCallback(
    async ({ itemId, quantity }) => {
      if (!cartId) return null;
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch(
          `/carts/${cartId}/items/${itemId}`,
          {
            method: 'PATCH',
            body: JSON.stringify({ quantity }),
          },
          token
        );
        setCart(data);
        return data;
      } catch (err) {
        setError(err.message || 'Failed to update item');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [cartId, token]
  );

  // Remove an item from the cart
  const removeItem = useCallback(
    async ({ itemId }) => {
      if (!cartId) return null;
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch(
          `/carts/${cartId}/items/${itemId}`,
          { method: 'DELETE' },
          token
        );
        setCart(data);
        return data;
      } catch (err) {
        setError(err.message || 'Failed to remove item');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [cartId, token]
  );

  // Apply a promo code
  const applyPromo = useCallback(
    async ({ promoCode }) => {
      if (!cartId) return null;
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch(
          `/carts/${cartId}/promo`,
          {
            method: 'POST',
            body: JSON.stringify({ promoCode }),
          },
          token
        );
        setCart(data);
        return data;
      } catch (err) {
        setError(err.message || 'Failed to apply promo code');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [cartId, token]
  );

  // Clear cart state (e.g. after order is placed)
  const clearCart = useCallback(() => {
    persistCartId(null);
    setGuestCartId(null);
    setCart(null);
  }, [persistCartId, setGuestCartId]);

  // Merge guest cart into authenticated cart after login
  const mergeGuestCart = useCallback(
    async (authenticatedCartId) => {
      if (mergeInProgress.current) return;
      const guestId = getGuestCartId();
      if (!guestId || guestId === authenticatedCartId) {
        setGuestCartId(null);
        return;
      }
      mergeInProgress.current = true;
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch(
          `/carts/${authenticatedCartId}/merge`,
          {
            method: 'POST',
            body: JSON.stringify({ guestCartId: guestId }),
          },
          token
        );
        setCart(data);
        setGuestCartId(null);
      } catch {
        // Merge failure is non-fatal; continue with authenticated cart
      } finally {
        setLoading(false);
        mergeInProgress.current = false;
      }
    },
    [getGuestCartId, setGuestCartId, token]
  );

  // On mount / auth change: fetch existing cart or merge guest cart
  useEffect(() => {
    if (isAuthenticated && !isGuest) {
      // Authenticated user: ensure they have a cart, then merge any guest cart
      const run = async () => {
        let activeCartId = cartId;
        if (!activeCartId) {
          activeCartId = await createCart();
        } else {
          await fetchCart(activeCartId);
        }
        if (activeCartId) {
          await mergeGuestCart(activeCartId);
        }
      };
      run();
    } else {
      // Guest or unauthenticated: fetch existing guest cart or create one lazily
      if (cartId) {
        fetchCart(cartId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isGuest]);

  // Derived helpers
  const itemCount = cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
  const cartTotal = cart?.total ?? cart?.subtotal ?? 0;

  const value = {
    cart,
    cartId,
    loading,
    error,
    itemCount,
    cartTotal,
    fetchCart,
    createCart,
    ensureCart,
    addItem,
    updateItem,
    removeItem,
    applyPromo,
    clearCart,
    mergeGuestCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}

export default CartContext;
