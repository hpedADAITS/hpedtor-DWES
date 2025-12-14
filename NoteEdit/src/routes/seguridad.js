import { Router } from 'express';
import {
  accesoAdmin,
  accesoPublico,
  accesoVip,
} from '../controllers/seguridad.js';
import {
  validarToken,
  requerirRol,
  validarAdminUsuario,
} from '../middlewares/index.js';

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
