import bcrypt from 'bcrypt';
import config from '../config.js';

const extraerToken = (req) => {
  const bruto = req.headers.authorization || req.headers['x-token'];
  if (!bruto) return null;
  if (bruto.startsWith('Bearer ')) return bruto.slice(7);
  return bruto;
};

export const validarToken = async (req, res, next) => {
  const token = extraerToken(req);
  if (!token) return res.status(401).json({ mensaje: 'token requerido' });
  try {
    const ok = await bcrypt.compare('I know your secret', token);
    if (!ok) return res.status(403).json({ mensaje: 'token invalido' });
    return next();
  } catch (err) {
    return res.status(500).json({ mensaje: 'error validando token' });
  }
};

export const requerirRol = (rolesPermitidos) => (req, res, next) => {
  const rol = req.headers['x-rol'];
  if (!rol) return res.status(401).json({ mensaje: 'rol requerido' });
  if (!rolesPermitidos.includes(rol)) {
    return res.status(403).json({ mensaje: 'rol no permitido' });
  }
  req.rol = rol;
  return next();
};

export const validarAdminUsuario = (req, res, next) => {
  const usuario = req.headers['x-usuario'];
  if (!usuario) return res.status(401).json({ mensaje: 'usuario requerido' });
  if (usuario !== config.adminUsuario) {
    return res.status(403).json({ mensaje: 'usuario admin no valido' });
  }
  return next();
};
