import 'dotenv/config';
import Joi from 'joi';

const schema = Joi.object({
  // Server
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().integer().default(3000),

  // Database
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().integer().default(5432),
  DB_NAME: Joi.string().default('ecommerce'),
  DB_USER: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default('postgres'),
  DB_POOL_MIN: Joi.number().integer().default(2),
  DB_POOL_MAX: Joi.number().integer().default(10),

  // Elasticsearch
  ELASTICSEARCH_NODE: Joi.string().default('http://localhost:9200'),
  ELASTICSEARCH_USERNAME: Joi.string().allow('').default(''),
  ELASTICSEARCH_PASSWORD: Joi.string().allow('').default(''),
  ELASTICSEARCH_INDEX_PRODUCTS: Joi.string().default('products'),

  // JWT
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: Joi.number().integer().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: Joi.number().integer().default(100),
  RATE_LIMIT_AUTH_WINDOW_MS: Joi.number().integer().default(15 * 60 * 1000),
  RATE_LIMIT_AUTH_MAX: Joi.number().integer().default(10),

  // CORS
  CORS_ORIGIN: Joi.string().default('http://localhost:5173'),

  // Bcrypt
  BCRYPT_ROUNDS: Joi.number().integer().default(12),

  // Logging
  LOG_LEVEL: Joi.string().valid('fatal', 'error', 'warn', 'info', 'debug', 'trace').default('info'),
}).unknown(true);

const { error, value: env } = schema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: env.NODE_ENV,
  port: env.PORT,

  db: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    name: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    pool: {
      min: env.DB_POOL_MIN,
      max: env.DB_POOL_MAX,
    },
  },

  elasticsearch: {
    node: env.ELASTICSEARCH_NODE,
    username: env.ELASTICSEARCH_USERNAME,
    password: env.ELASTICSEARCH_PASSWORD,
    indices: {
      products: env.ELASTICSEARCH_INDEX_PRODUCTS,
    },
  },

  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshSecret: env.JWT_REFRESH_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },

  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    auth: {
      windowMs: env.RATE_LIMIT_AUTH_WINDOW_MS,
      max: env.RATE_LIMIT_AUTH_MAX,
    },
  },

  cors: {
    origin: env.CORS_ORIGIN,
  },

  bcrypt: {
    rounds: env.BCRYPT_ROUNDS,
  },

  log: {
    level: env.LOG_LEVEL,
  },
};

export default config;
