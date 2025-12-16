import { logger } from '../utils/index.js';

export const rutaNoEncontrada = (req, res) => {
  res.status(404).json({ mensaje: 'ruta no encontrada' });
};

export const manejarErrores = (err, req, res, next) => {
  Boolean(next);
  logger.error(err?.message || err);
  res.status(500).send('Server Error');
};
