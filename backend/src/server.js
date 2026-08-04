import { createApp } from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';

const app = createApp();
const port = config.port || 3000;

app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
