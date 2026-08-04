import config from './index.js';

const rateLimitConfig = {
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  auth: {
    windowMs: config.rateLimit.auth.windowMs,
    max: config.rateLimit.auth.max,
  },
};

export default rateLimitConfig;
