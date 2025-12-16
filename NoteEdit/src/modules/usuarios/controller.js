import { obtenerUsuarios } from './service.js';

export const listarUsuarios = (req, res, next) => {
  try {
    const usuarios = obtenerUsuarios();
    return res.json({ datos: usuarios });
  } catch (err) {
    return next(err);
  }
};
