import { horaSimple } from '../utils/index.js';

export const loggerBasico = (req, res, next) => {
  console.log(`[${horaSimple()}] ${req.method} ${req.url}`);
  next();
};
