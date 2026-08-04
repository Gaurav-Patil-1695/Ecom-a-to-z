# Frontend

React + Vite single-page application for the Shop platform.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| npm | ≥ 9 |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file and fill in values
cp .env.example .env

# 3. Start development server (http://localhost:5173)
npm run dev
```

The Vite dev-server automatically proxies every request that starts with `/api` to `http://localhost:4000` (see `vite.config.js`), so the backend must be running locally or via Docker.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev-server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across all `.js` / `.jsx` files |
| `npm test` | Run Jest unit tests |

---

## Environment Variables

Copy `.env.example` to `.env` before running the app.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | No | `http://localhost:4000` | Full origin of the backend API. Used by the Axios client when the Vite proxy is not available (e.g. production deploys). |

> **Note:** All variables that must be available in the browser **must** be prefixed with `VITE_`. Variables without that prefix are ignored by Vite at build time.

### Development vs Production

- **Development** – Leave `VITE_API_BASE_URL` at its default. The Vite proxy rewrites `/api/*` requests to `http://localhost:4000` automatically.
- **Production** – Set `VITE_API_BASE_URL` to the deployed API origin (e.g. `https://api.example.com`). The Axios client reads this value at runtime.

---

## Project Structure

```
frontend/
├── index.html              # HTML entry point
├── vite.config.js          # Vite + proxy configuration
├── tailwind.config.js      # Tailwind CSS configuration (extends design tokens)
├── postcss.config.js       # PostCSS plugins
├── eslint.config.js        # ESLint flat config
├── .env.example            # Environment variable template
├── package.json
└── src/
    ├── main.jsx            # React root / QueryClientProvider / Router
    ├── App.jsx             # Top-level route tree
    ├── index.css           # Tailwind base/components/utilities imports
    ├── assets/
    │   ├── images/         # logo.svg, placeholder-product.svg, empty-state.svg
    │   └── icons/          # SVG icon set
    ├── config/
    │   └── tailwind.config.js   # Design token definitions (colors, spacing, typography)
    ├── routes/
    │   ├── index.jsx            # Centralised <Routes> tree
    │   ├── ProtectedRoute.jsx   # Requires authenticated user
    │   ├── AdminRoute.jsx       # Requires admin role
    │   └── GuestRoute.jsx       # Redirects authenticated users away
    ├── pages/              # One file per screen (see Route Map below)
    ├── components/         # Shared and feature-specific UI components
    ├── hooks/              # Custom React hooks
    ├── api/                # Axios instances + per-module API functions
    ├── store/              # Global state (auth, cart)
    └── utils/              # Pure helper functions
```

---

## Design Token Usage

Design tokens are defined in `src/config/tailwind.config.js` and extended into Tailwind via `tailwind.config.js`.

### Colours

Use Tailwind utility classes that map to the token names:

```jsx
// Primary brand colour
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Add to cart
</button>

// Semantic colours
<span className="text-success">In stock</span>
<span className="text-destructive">Out of stock</span>
<span className="text-warning">Low stock</span>
```

### Typography Scale

```jsx
<h1 className="text-4xl font-bold tracking-tight">Page Title</h1>
<h2 className="text-2xl font-semibold">Section Heading</h2>
<p className="text-base text-muted-foreground">Body copy</p>
<small className="text-sm text-muted-foreground">Helper text</small>
```

### Spacing

Spacing follows the default Tailwind scale (multiples of 4 px). Prefer named utilities (`p-4`, `gap-6`, `mb-8`) over arbitrary values.

### Shadows & Radius

```jsx
<div className="rounded-lg shadow-card">Product card</div>
<div className="rounded-xl shadow-md">Modal / drawer</div>
```

### Importing Tokens in JS

If you need raw token values inside JS/TS:

```js
import tailwindTokens from '@/config/tailwind.config.js';

const primaryColor = tailwindTokens.colors.primary.DEFAULT;
```

---

## Route Map

All routes are declared in `src/routes/index.jsx`.

### Public Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `pages/Home` | Homepage / hero + featured products |
| `/products` | `pages/catalogue/ProductListing` | Full product catalogue with filters |
| `/categories/:categoryId` | `pages/catalogue/CategoryProductListing` | Products filtered by category |
| `/products/:productId` | `pages/catalogue/ProductDetail` | Product detail + variant picker |
| `/search` | `pages/catalogue/SearchResults` | Full-text search results |
| `/cart` | `pages/cart/Cart` | Shopping cart |
| `/login` | `pages/auth/Login` | Login form |
| `/register` | `pages/auth/Register` | Registration form |
| `/forgot-password` | `pages/auth/ForgotPassword` | Request password reset |
| `/reset-password` | `pages/auth/ResetPassword` | Consume reset token |
| `*` | `pages/NotFound` | 404 catch-all |

### Guest-Only Routes (redirect if authenticated)

Wrapped by `<GuestRoute>`.

| Path | Component | Description |
|------|-----------|-------------|
| `/checkout/guest-register` | `pages/checkout/GuestPostCheckoutRegister` | Prompt guest to create account after order |

### Protected Routes (require authenticated user)

Wrapped by `<ProtectedRoute>`.

| Path | Component | Description |
|------|-----------|-------------|
| `/checkout/address` | `pages/checkout/CheckoutAddress` | Select or add delivery address |
| `/checkout/review` | `pages/checkout/CheckoutReview` | Order review before payment |
| `/checkout/payment` | `pages/checkout/CheckoutPayment` | Payment initiation |
| `/checkout/confirmation` | `pages/checkout/CheckoutConfirmation` | Order placed confirmation |
| `/account` | `pages/account/AccountOverview` | Account dashboard |
| `/account/profile` | `pages/account/AccountProfile` | Edit profile details |
| `/account/addresses` | `pages/account/AccountAddresses` | List saved addresses |
| `/account/addresses/new` | `pages/account/AddressNew` | Add new address |
| `/account/addresses/:addressId/edit` | `pages/account/AddressEdit` | Edit existing address |
| `/account/orders` | `pages/account/OrderHistory` | Order history list |
| `/account/orders/:orderId` | `pages/account/OrderDetail` | Order detail + tracking |
| `/account/orders/:orderId/return` | `pages/account/ReturnRequest` | Raise a return request |
| `/account/notifications` | `pages/account/Notifications` | In-app notifications |

### Admin Routes (require admin role)

Wrapped by `<AdminRoute>` inside `<AdminShell>`.

| Path | Component | Description |
|------|-----------|-------------|
| `/admin` | `pages/admin/AdminDashboard` | Admin overview |
| `/admin/reports` | `pages/admin/AdminReports` | Analytics & reports |
| `/admin/orders` | `pages/admin/orders/AdminOrderList` | All orders |
| `/admin/orders/:orderId` | `pages/admin/orders/AdminOrderDetail` | Order detail + actions |
| `/admin/catalogue/products` | `pages/admin/catalogue/AdminProductList` | Product catalogue |
| `/admin/catalogue/products/new` | `pages/admin/catalogue/AdminProductNew` | Create product |
| `/admin/catalogue/products/:productId/edit` | `pages/admin/catalogue/AdminProductEdit` | Edit product |
| `/admin/catalogue/categories` | `pages/admin/catalogue/AdminCategoryList` | Category list |
| `/admin/catalogue/categories/new` | `pages/admin/catalogue/AdminCategoryNew` | Create category |
| `/admin/catalogue/categories/:categoryId/edit` | `pages/admin/catalogue/AdminCategoryEdit` | Edit category |
| `/admin/catalogue/brands` | `pages/admin/catalogue/AdminBrandList` | Brand list |
| `/admin/catalogue/brands/new` | `pages/admin/catalogue/AdminBrandNew` | Create brand |
| `/admin/catalogue/brands/:brandId/edit` | `pages/admin/catalogue/AdminBrandEdit` | Edit brand |
| `/admin/promotions` | `pages/admin/promotions/AdminPromotionList` | Promo codes list |
| `/admin/promotions/new` | `pages/admin/promotions/AdminPromotionNew` | Create promo code |
| `/admin/promotions/:promoId/edit` | `pages/admin/promotions/AdminPromotionEdit` | Edit promo code |
| `/admin/returns` | `pages/admin/returns/AdminReturnList` | Return requests list |
| `/admin/returns/:returnRequestId` | `pages/admin/returns/AdminReturnDetail` | Return request detail |
| `/admin/users` | `pages/admin/users/AdminUserList` | User list |
| `/admin/users/:userId` | `pages/admin/users/AdminUserDetail` | User detail |

---

## API Client

All HTTP calls are made via a central Axios instance located in `src/api/`. The base URL is resolved as follows:

```
VITE_API_BASE_URL (env) → fallback: '' (relative, uses Vite proxy in dev)
```

Endpoints mirror the backend contract exactly — method, path, and function name are kept identical. Example:

```js
// src/api/catalogue.js
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (productId) => api.get(`/products/${productId}`);
```

### React Query

Server state is managed with `@tanstack/react-query`. Custom hooks in `src/hooks/` wrap each API function:

```js
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/api/catalogue';

export function useProducts(params) {
  return useQuery({ queryKey: ['products', params], queryFn: () => getProducts(params) });
}
```

---

## Linting

ESLint is configured with:

- `eslint:recommended`
- `eslint-plugin-react` + `eslint-plugin-react-hooks`
- `eslint-plugin-jsx-a11y` (accessibility)
- `eslint-plugin-import` (import ordering)
- `eslint-plugin-react-refresh`

Run the linter:

```bash
npm run lint
```

---

## Testing

Unit and integration tests use Jest + `@testing-library/react`.

```bash
npm test
```

Test files live alongside the code they test with the naming convention `*.test.jsx`.

---

## Docker

The frontend is included in the root `docker-compose.yml`. To run everything together:

```bash
# From the repository root
docker-compose up --build
```

The frontend container serves the production build via a static file server on port `5173`.
