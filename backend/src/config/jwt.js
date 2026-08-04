import config from './index.js';

const jwtConfig = {
  secret: config.jwt.secret,
  accessTokenTTL: config.jwt.expiresIn,
  refreshSecret: config.jwt.refreshSecret,
  resetTokenTTL: config.jwt.refreshExpiresIn,
};

export default jwtConfig;
