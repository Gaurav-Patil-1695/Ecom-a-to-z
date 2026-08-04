# E-Commerce Platform — Backend API

Node.js + Express REST API powering the e-commerce platform. Uses PostgreSQL via Knex.js for persistence, Elasticsearch for product search, and JWT for authentication.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Environment Variables](#environment-variables)
4. [Database Migrations](#database-migrations)
5. [Seeding](#seeding)
6. [Running the Server](#running-the-server)
7. [Running Tests](#running-tests)
8. [Linting](#linting)
9. [Project Structure](#project-structure)
10. [Module Dependency Direction — ADR Summary](#module-dependency-direction--adr-summary)

---

## Prerequisites

| Tool | Minimum Version |
|------|-----------------|
| Node.js | 18.x |
| npm | 9.x |
| PostgreSQL | 14.x |
| Elasticsearch | 8.x (optional — search endpoints degrade gracefully without it) |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file and fill in values
cp .env.example .env

# 3. Create the development database (psql or your preferred client)
createdb ecommerce_dev

# 4. Run all migrations
npm run migrate

# 5. Seed reference data
npm run seed

# 6. Start the development server (hot-reload via nodemon)
npm run dev
```

The API will be available at `http://localhost:4000` (or the port set in `PORT`).

---

## Environment Variables

Copy `.env.example` to `.env` and set the values appropriate for your environment. All variables are listed below.

### Application

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Runtime environment: `development`, `test`, or `production` |
| `PORT` | `4000` | Port the Express server listens on |
| `API_BASE_URL` | `http://localhost:4000` | Public base URL used to construct absolute URLs (e.g. image links) |

### Database (PostgreSQL)

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `127.0.0.1` | PostgreSQL hostname or IP |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `ecommerce_dev` | Application database name |
| `DB_USER` | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | `postgres` | PostgreSQL password |
| `DB_SSL` | `false` | Set to `true` to enable SSL (recommended in production) |

### Test Database (PostgreSQL)

| Variable | Default | Description |
|----------|---------|-------------|
| `TEST_DB_HOST` | `127.0.0.1` | Test PostgreSQL hostname |
| `TEST_DB_PORT` | `5432` | Test PostgreSQL port |
| `TEST_DB_NAME` | `ecommerce_test` | Test database name |
| `TEST_DB_USER` | `postgres` | Test PostgreSQL username |
| `TEST_DB_PASSWORD` | `postgres` | Test PostgreSQL password |

### Authentication / JWT

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | *(required)* | Secret used to sign access tokens — keep long, random, and private |
| `JWT_EXPIRES_IN` | `1h` | Access token lifetime (zeit/ms string, e.g. `15m`, `1h`, `7d`) |
| `JWT_REFRESH_SECRET` | *(required)* | Secret used to sign refresh tokens — must differ from `JWT_SECRET` |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh token lifetime |

### Elasticsearch

| Variable | Default | Description |
|----------|---------|-------------|
| `ELASTICSEARCH_URL` | `http://localhost:9200` | Elasticsearch node URL |
| `ELASTICSEARCH_INDEX` | `products` | Index name for product documents |
| `ELASTICSEARCH_USERNAME` | *(blank)* | Elasticsearch username (leave blank if security disabled) |
| `ELASTICSEARCH_PASSWORD` | *(blank)* | Elasticsearch password (leave blank if security disabled) |

### Payment Gateway

| Variable | Default | Description |
|----------|---------|-------------|
| `PAYMENT_ADAPTER` | `mock` | Payment adapter: `mock`, `stripe`, or `razorpay` |
| `STRIPE_PUBLISHABLE_KEY` | *(blank)* | Stripe publishable key (required when `PAYMENT_ADAPTER=stripe`) |
| `STRIPE_SECRET_KEY` | *(blank)* | Stripe secret key (required when `PAYMENT_ADAPTER=stripe`) |
| `STRIPE_WEBHOOK_SECRET` | *(blank)* | Stripe webhook signing secret |
| `RAZORPAY_KEY_ID` | *(blank)* | Razorpay key ID (required when `PAYMENT_ADAPTER=razorpay`) |
| `RAZORPAY_KEY_SECRET` | *(blank)* | Razorpay key secret |

### Rate Limiting

| Variable | Default | Description |
|----------|---------|-------------|
| `RATE_LIMIT_MAX` | `100` | Maximum requests per window per IP (general endpoints) |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Window duration in milliseconds (default: 15 minutes) |
| `RATE_LIMIT_AUTH_MAX` | `20` | Maximum requests per window for auth endpoints |

### Logging

| Variable | Default | Description |
|----------|---------|-------------|
| `LOG_LEVEL` | `info` | Winston log level: `error`, `warn`, `info`, `http`, `verbose`, `debug`, `silly` |
| `LOG_PRETTY` | `true` | Set to `true` to pretty-print logs (recommended in development) |

### CORS

| Variable | Default | Description |
|----------|---------|-------------|
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated list of allowed CORS origins |

### Email

| Variable | Default | Description |
|----------|---------|-------------|
| `SMTP_HOST` | `smtp.mailtrap.io` | SMTP server hostname |
| `SMTP_PORT` | `587` | SMTP port (`587` for STARTTLS, `465` for SSL) |
| `SMTP_USER` | *(blank)* | SMTP username |
| `SMTP_PASS` | *(blank)* | SMTP password |
| `EMAIL_FROM` | `noreply@ecommerce.local` | "From" address on outgoing emails |

### Frontend

| Variable | Default | Description |
|----------|---------|-------------|
| `FRONTEND_URL` | `http://localhost:3000` | Public URL of the frontend (used in email links) |

---

## Database Migrations

Migrations live in `src/db/migrations/` and are numbered sequentially (`001_` … `022_`). Knex tracks applied migrations in the `knex_migrations` table.

```bash
# Apply all pending migrations
npm run migrate
# Equivalent: knex migrate:latest

# Roll back the most recent batch
npm run migrate:rollback
# Equivalent: knex migrate:rollback

# Roll back ALL migrations (batch by batch)
npm run migrate:rollback -- --all

# Check migration status
npx knex migrate:status

# Create a new migration file
npx knex migrate:make <migration_name>
```

### Migration Order

| File | Creates |
|------|---------|
| `001_create_roles.js` | `roles` |
| `002_create_users.js` | `users` |
| `003_create_user_roles.js` | `user_roles` |
| `004_create_addresses.js` | `addresses` |
| `005_create_serviceable_pin_codes.js` | `serviceable_pin_codes` |
| `006_create_categories.js` | `categories` |
| `007_create_brands.js` | `brands` |
| `008_create_products.js` | `products` |
| `009_create_product_images.js` | `product_images` |
| `010_create_skus.js` | `skus` |
| `011_create_promo_codes.js` | `promo_codes` |
| `012_create_carts.js` | `carts` |
| `013_create_cart_items.js` | `cart_items` |
| `014_create_orders.js` | `orders` |
| `015_create_order_items.js` | `order_items` |
| `016_create_order_status_history.js` | `order_status_history` |
| `017_create_stock_reservations.js` | `stock_reservations` |
| `018_create_payment_attempts.js` | `payment_attempts` |
| `019_create_refunds.js` | `refunds` |
| `020_create_return_requests.js` | `return_requests` |
| `021_create_order_tracking.js` | `order_tracking` |
| `022_create_notifications.js` | `notifications` |

---

## Seeding

Seeds live in `src/db/seeds/` and must be run **after** all migrations.

```bash
# Run all seed files in order
npm run seed
# Equivalent: knex seed:run

# Run a specific seed file
npx knex seed:run --specific=01_roles.js
```

### Seed Order

| File | Inserts |
|------|---------|
| `01_roles.js` | Default roles (`admin`, `customer`) |
| `02_admin_user.js` | Initial admin user |
| `03_categories.js` | Root and leaf categories |
| `04_brands.js` | Sample brands |
| `05_products_skus.js` | Sample products and SKUs |
| `06_promo_codes.js` | Sample promotional codes |

> **Warning:** Seeds are destructive — they truncate their target tables before inserting. Never run seeds against a production database.

---

## Running the Server

```bash
# Development (nodemon hot-reload)
npm run dev

# Production
npm start
```

---

## Running Tests

Tests use Jest with `--runInBand` (serial execution) to avoid database race conditions.

```bash
# Run the full test suite
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

The test suite targets the database configured by `TEST_DB_*` variables. Ensure `ecommerce_test` exists and migrations have been applied before running tests:

```bash
createdb ecommerce_test
NODE_ENV=test npx knex migrate:latest
```

---

## Linting

```bash
# Check for lint errors
npm run lint

# Auto-fix fixable errors
npm run lint:fix
```

The ESLint configuration (`eslintrc.js`) enforces the layered architecture import boundaries described below.

---

## Project Structure

```
backend/
├── src/
│   ├── app.js                     # Express application factory
│   ├── server.js                  # HTTP server entry point
│   ├── config/                    # Runtime configuration (env → typed config)
│   │   ├── index.js
│   │   ├── database.js
│   │   ├── elasticsearch.js
│   │   ├── jwt.js
│   │   └── rateLimit.js
│   ├── middleware/                # Express middleware
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   ├── requestLogger.js
│   │   └── validate.js
│   ├── modules/                   # Feature modules (routes + controller + service + validator)
│   │   ├── auth/
│   │   ├── users/
│   │   ├── roles/
│   │   ├── addresses/
│   │   ├── catalogue/
│   │   ├── search/
│   │   ├── cart/
│   │   ├── promotions/
│   │   ├── checkout/
│   │   ├── payments/
│   │   ├── orders/
│   │   ├── returns/
│   │   ├── notifications/
│   │   └── admin/
│   ├── db/
│   │   ├── client.js              # Knex singleton
│   │   ├── migrations/
│   │   ├── seeds/
│   │   └── repositories/          # Data-access layer
│   └── utils/
│       ├── asyncHandler.js
│       ├── logger.js
│       ├── pagination.js
│       └── tokenUtils.js
├── .env.example
├── .eslintrc.js
├── .gitignore
├── babel.config.cjs
├── jest.config.cjs
├── jest.setup.cjs
├── knexfile.js
├── package.json
└── README.md
```

---

## Module Dependency Direction — ADR Summary

### Decision

All code inside `src/` must follow a **strict top-down dependency direction**:

```
Routes / Controllers
        ↓
    Services
        ↓
   Repositories
        ↓
    DB Client (Knex)
```

### Rules

| Layer | May import from | Must NOT import from |
|-------|----------------|---------------------|
| **Routes / Controllers** (`src/modules/**/*.routes.js`, `*.controller.js`) | Services, middleware, utils, config | Repositories, DB client directly |
| **Services** (`src/modules/**/*.service.js`) | Repositories, utils, config | Other modules' services (prefer direct repository use or events), routes/controllers |
| **Repositories** (`src/db/repositories/`) | DB client (`src/db/client.js`), utils | Services, controllers, routes, middleware |
| **Middleware** (`src/middleware/`) | Utils, config | Routes, controllers, service modules |
| **Config** (`src/config/`) | Node built-ins, environment | Any `src/` layer above |
| **Utils** (`src/utils/`) | Node built-ins, external packages | Any `src/` layer above |

### Rationale

- **Testability:** Services and repositories can be unit-tested by injecting a mock at the layer boundary immediately below them.
- **Replaceability:** Swapping the database client or an external adapter (e.g. payment gateway, search engine) requires changes only in the repository or adapter layer — the service and controller code remains untouched.
- **Cycle prevention:** A strict downward-only dependency graph guarantees no circular imports. The `import/no-cycle` and `import/no-restricted-paths` ESLint rules enforce this mechanically at development time.
- **Readability:** A developer reading a service file can trust it contains only business logic — no SQL strings, no HTTP request parsing.

### Payment and Search Adapters

External integrations (Elasticsearch, payment gateways) follow the same principle through an **adapter pattern**:

```
Service
  ↓
Adapter Interface (defines contract)
  ↓
Concrete Adapter (e.g. elasticsearch.adapter.js, mock.adapter.js)
  ↓
External SDK / HTTP client
```

The active adapter is selected at startup via environment variables (`PAYMENT_ADAPTER`, `ELASTICSEARCH_URL`) so that the service layer never contains provider-specific branching logic.

### Enforcement

The rules above are enforced by ESLint (`import/no-restricted-paths`, `import/no-cycle`) configured in `.eslintrc.js`. CI must run `npm run lint` and fail the build on any violation.
