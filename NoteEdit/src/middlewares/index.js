import { logger } from '../utils/index.js';

export const loggerBasico = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
};
