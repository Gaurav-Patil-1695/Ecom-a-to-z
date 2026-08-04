const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';
const ELASTICSEARCH_URL = import.meta.env.VITE_ELASTICSEARCH_URL || 'http://localhost:9200';
const ENABLE_MOCK_PAYMENTS = import.meta.env.VITE_ENABLE_MOCK_PAYMENTS === 'true';
const APP_NAME = import.meta.env.VITE_APP_NAME || 'ShopApp';
const TOKEN_STORAGE_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY || 'auth_token';
const REFRESH_TOKEN_STORAGE_KEY = import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY || 'refresh_token';
const CART_STORAGE_KEY = import.meta.env.VITE_CART_STORAGE_KEY || 'cart_id';
const DEFAULT_PAGE_SIZE = Number(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 20;

export {
  API_BASE_URL,
  APP_ENV,
  ELASTICSEARCH_URL,
  ENABLE_MOCK_PAYMENTS,
  APP_NAME,
  TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
  CART_STORAGE_KEY,
  DEFAULT_PAGE_SIZE,
};
