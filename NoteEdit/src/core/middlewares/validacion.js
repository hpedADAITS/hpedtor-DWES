import { ZodError } from 'zod';

const formatearErrores = (error) => error.errors.map((detalle) => ({
  campo: detalle.path.join('.') || 'root',
  mensaje: detalle.message,
}));

const manejarError = (err, res) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ mensaje: 'datos invalidos', errores: formatearErrores(err) });
  }
  return res.status(500).json({ mensaje: 'error validando datos' });
};

export const validarBody = (schema) => (req, res, next) => {
  try {
    const limpio = schema.parse(req.body || {});
    req.body = limpio;
    return next();
  } catch (err) {
    return manejarError(err, res);
  }
};

export const validarParams = (schema) => (req, res, next) => {
  try {
    const limpio = schema.parse(req.params || {});
    req.params = limpio;
    return next();
  } catch (err) {
    return manejarError(err, res);
  }
};

export const validarQuery = (schema) => (req, res, next) => {
  try {
    const limpio = schema.parse(req.query || {});
    req.queryValidada = limpio;
    return next();
  } catch (err) {
    return manejarError(err, res);
  }
};
