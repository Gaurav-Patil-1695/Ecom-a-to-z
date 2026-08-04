import morgan from 'morgan';
import winston from 'winston';

/**
 * Winston logger instance used for HTTP request logging.
 * Logs are written to stdout in JSON format in production,
 * and in a colourised simple format in all other environments.
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format:
    process.env.NODE_ENV === 'production'
      ? winston.format.combine(winston.format.timestamp(), winston.format.json())
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.printf(
            ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`,
          ),
        ),
  transports: [new winston.transports.Console()],
});

/**
 * Morgan write-stream that pipes HTTP log lines into Winston at the
 * 'http' level (falls back to 'info' so all environments capture it).
 */
const stream = {
  write(message) {
    logger.info(message.trimEnd());
  },
};

/**
 * Morgan token: response time in milliseconds (already built-in, included
 * here as a reminder that the format below uses it).
 *
 * Custom format that surfaces the most operationally useful fields:
 *   :method :url :status :res[content-length] bytes - :response-time ms
 */
const morganFormat =
  process.env.NODE_ENV === 'production'
    ? 'combined'
    : ':method :url :status :res[content-length] bytes - :response-time ms';

/**
 * Express middleware that logs every incoming HTTP request.
 * Uses Morgan under the hood and routes the output through Winston so that
 * all application log output goes to a single, configurable transport.
 *
 * Usage:
 *   app.use(requestLogger)
 */
export const requestLogger = morgan(morganFormat, { stream });

export { logger };

export default requestLogger;
