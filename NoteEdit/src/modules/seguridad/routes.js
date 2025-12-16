import { Router } from 'express';
import {
  accesoAdmin,
  accesoPublico,
  accesoVip,
} from './controller.js';
import {
  validarToken,
  requerirRol,
  validarAdminUsuario,
} from '../../core/middlewares/index.js';

const router = Router();

router.get('/public', accesoPublico);
router.get('/vip', validarToken, requerirRol(['usuario', 'admin']), accesoVip);
router.get(
  '/admin',
  validarToken,
  requerirRol(['admin']),
  validarAdminUsuario,
  accesoAdmin,
);

export default router;
