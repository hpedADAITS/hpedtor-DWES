import { obtenerUsuarios } from '../services/index.js';

export const listarUsuarios = (req, res) => {
  const usuarios = obtenerUsuarios();
  res.json({ datos: usuarios });
};
