import config from './index.js';

const databaseConfig = {
  client: 'postgresql',
  connection: {
    host: config.db.host,
    port: config.db.port,
    database: config.db.name,
    user: config.db.user,
    password: config.db.password,
  },
  pool: {
    min: config.db.pool.min,
    max: config.db.pool.max,
  },
  migrations: {
    directory: '../db/migrations',
    extension: 'js',
  },
  seeds: {
    directory: '../db/seeds',
    extension: 'js',
  },
};

export default databaseConfig;
