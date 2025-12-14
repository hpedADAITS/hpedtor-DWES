import { logger } from '../utils/index.js';

export const loggerBasico = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
};

export * from './auth.js';
export { validarBody, validarParams, validarQuery } from './validacion.js';
