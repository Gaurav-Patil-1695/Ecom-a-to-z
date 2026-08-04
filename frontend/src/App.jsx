import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ─── Auth Context ────────────────────────────────────────────────────────────
export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || null);
  const [loading, setLoading] = useState(false);

  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('auth_token', authToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  }, []);

  const value = { user, token, loading, setLoading, login, logout, updateUser, isAuthenticated: !!token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Cart Context ─────────────────────────────────────────────────────────────
export const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}

function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [cartId, setCartId] = useState(() => localStorage.getItem('cart_id') || null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (cart && cart.items) {
      const count = cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(count);
    } else {
      setCartCount(0);
    }
  }, [cart]);

  const updateCart = useCallback((cartData) => {
    setCart(cartData);
    if (cartData && cartData.id) {
      setCartId(cartData.id);
      localStorage.setItem('cart_id', cartData.id);
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart(null);
    setCartId(null);
    setCartCount(0);
    localStorage.removeItem('cart_id');
  }, []);

  const value = { cart, cartId, cartCount, updateCart, clearCart, setCartId };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Notifications Context ────────────────────────────────────────────────────
export const NotificationsContext = createContext(null);

export function useNotifications() {
  return useContext(NotificationsContext);
}

function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const count = notifications.filter((n) => !n.read_at).length;
    setUnreadCount(count);
  }, [notifications]);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  const markRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
  }, []);

  const setAllNotifications = useCallback((data) => {
    setNotifications(data);
  }, []);

  const value = { notifications, unreadCount, addNotification, markRead, markAllRead, setAllNotifications };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

// ─── Lazy page imports ────────────────────────────────────────────────────────
const HomePage = React.lazy(() => import('./pages/HomePage'));
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const CartPage = React.lazy(() => import('./pages/CartPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = React.lazy(() => import('./pages/OrderConfirmationPage'));
const OrderDetailPage = React.lazy(() => import('./pages/OrderDetailPage'));
const OrdersPage = React.lazy(() => import('./pages/OrdersPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const AddressesPage = React.lazy(() => import('./pages/AddressesPage'));
const NotificationsPage = React.lazy(() => import('./pages/NotificationsPage'));
const ReturnRequestPage = React.lazy(() => import('./pages/ReturnRequestPage'));
const AdminDashboardPage = React.lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminProductsPage = React.lazy(() => import('./pages/admin/AdminProductsPage'));
const AdminCategoriesPage = React.lazy(() => import('./pages/admin/AdminCategoriesPage'));
const AdminOrdersPage = React.lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminReturnsPage = React.lazy(() => import('./pages/admin/AdminReturnsPage'));
const AdminPromoCodesPage = React.lazy(() => import('./pages/admin/AdminPromoCodesPage'));
const AdminBrandsPage = React.lazy(() => import('./pages/admin/AdminBrandsPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// ─── Protected Route ──────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  const isAdmin = user && user.roles && user.roles.some((r) => r === 'admin' || r.name === 'admin');
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <NotificationsProvider>
            <React.Suspense fallback={<div className="page-loading">Loading…</div>}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/products/:productId" element={<ProductDetailPage />} />
                <Route path="/categories/:categoryId" element={<CategoryPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Protected user routes */}
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
                <Route path="/orders/:orderId/confirmation" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
                <Route path="/orders/:orderId/return" element={<ProtectedRoute><ReturnRequestPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/addresses" element={<ProtectedRoute><AddressesPage /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

                {/* Admin routes */}
                <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
                <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
                <Route path="/admin/returns" element={<AdminRoute><AdminReturnsPage /></AdminRoute>} />
                <Route path="/admin/promo-codes" element={<AdminRoute><AdminPromoCodesPage /></AdminRoute>} />
                <Route path="/admin/brands" element={<AdminRoute><AdminBrandsPage /></AdminRoute>} />

                {/* Fallback */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </React.Suspense>
          </NotificationsProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
