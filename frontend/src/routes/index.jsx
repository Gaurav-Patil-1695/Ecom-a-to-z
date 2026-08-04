import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import GuestRoute from './GuestRoute';

import App from '@/App';

// Lazy imports for code splitting
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('@/pages/HomePage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutReviewPage = lazy(() => import('@/pages/CheckoutReviewPage'));
const CheckoutAddressPage = lazy(() => import('@/pages/CheckoutAddressPage'));
const CheckoutPaymentPage = lazy(() => import('@/pages/CheckoutPaymentPage'));
const OrderConfirmationPage = lazy(() => import('@/pages/OrderConfirmationPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));
const OrdersPage = lazy(() => import('@/pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('@/pages/OrderDetailPage'));
const OrderTrackingPage = lazy(() => import('@/pages/OrderTrackingPage'));
const AddressesPage = lazy(() => import('@/pages/AddressesPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const ReturnRequestPage = lazy(() => import('@/pages/ReturnRequestPage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'));
const AdminCategoriesPage = lazy(() => import('@/pages/admin/AdminCategoriesPage'));
const AdminBrandsPage = lazy(() => import('@/pages/admin/AdminBrandsPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'));
const AdminReportsPage = lazy(() => import('@/pages/admin/AdminReportsPage'));
const AdminPromoCodesPage = lazy(() => import('@/pages/admin/AdminPromoCodesPage'));
const AdminReturnRequestsPage = lazy(() => import('@/pages/admin/AdminReturnRequestsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const withSuspense = (Component) => (
  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><span>Loading...</span></div>}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: withSuspense(HomePage),
      },
      {
        path: 'search',
        element: withSuspense(SearchPage),
      },
      {
        path: 'products/:productId',
        element: withSuspense(ProductDetailPage),
      },
      {
        path: 'categories/:categoryId',
        element: withSuspense(CategoryPage),
      },
      {
        path: 'cart',
        element: withSuspense(CartPage),
      },
      {
        path: 'checkout',
        element: <ProtectedRoute />,
        children: [
          {
            path: 'address',
            element: withSuspense(CheckoutAddressPage),
          },
          {
            path: 'review',
            element: withSuspense(CheckoutReviewPage),
          },
          {
            path: 'payment',
            element: withSuspense(CheckoutPaymentPage),
          },
          {
            path: 'confirmation/:orderId',
            element: withSuspense(OrderConfirmationPage),
          },
        ],
      },
      {
        path: 'auth',
        element: <GuestRoute />,
        children: [
          {
            path: 'login',
            element: withSuspense(LoginPage),
          },
          {
            path: 'register',
            element: withSuspense(RegisterPage),
          },
          {
            path: 'forgot-password',
            element: withSuspense(ForgotPasswordPage),
          },
          {
            path: 'reset-password',
            element: withSuspense(ResetPasswordPage),
          },
        ],
      },
      {
        path: 'account',
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: withSuspense(AccountPage),
          },
          {
            path: 'orders',
            element: withSuspense(OrdersPage),
          },
          {
            path: 'orders/:orderId',
            element: withSuspense(OrderDetailPage),
          },
          {
            path: 'orders/:orderId/tracking',
            element: withSuspense(OrderTrackingPage),
          },
          {
            path: 'orders/:orderId/return-requests/:returnRequestId',
            element: withSuspense(ReturnRequestPage),
          },
          {
            path: 'addresses',
            element: withSuspense(AddressesPage),
          },
          {
            path: 'notifications',
            element: withSuspense(NotificationsPage),
          },
        ],
      },
      {
        path: 'admin',
        element: <AdminRoute />,
        children: [
          {
            index: true,
            element: withSuspense(AdminDashboardPage),
          },
          {
            path: 'products',
            element: withSuspense(AdminProductsPage),
          },
          {
            path: 'categories',
            element: withSuspense(AdminCategoriesPage),
          },
          {
            path: 'brands',
            element: withSuspense(AdminBrandsPage),
          },
          {
            path: 'orders',
            element: withSuspense(AdminOrdersPage),
          },
          {
            path: 'reports',
            element: withSuspense(AdminReportsPage),
          },
          {
            path: 'promo-codes',
            element: withSuspense(AdminPromoCodesPage),
          },
          {
            path: 'return-requests',
            element: withSuspense(AdminReturnRequestsPage),
          },
        ],
      },
      {
        path: '*',
        element: withSuspense(NotFoundPage),
      },
    ],
  },
]);

export default router;
