import { logger } from '../utils/index.js';
import { rutaNoEncontrada, manejarErrores } from './errores.js';

export const loggerBasico = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
};

export * from './auth.js';
export { validarBody, validarParams, validarQuery } from './validacion.js';
export { rutaNoEncontrada, manejarErrores };
