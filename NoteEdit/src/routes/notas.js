import { Router } from 'express';
import {
  obtenerNotas,
  crearNota,
  obtenerNota,
  editarNota,
  borrarNotaControlador,
} from '../controllers/notas.js';
import { validarToken, requerirRol, validarBody, validarParams } from '../middlewares/index.js';
import { esquemaActualizarNota, esquemaCrearNota, esquemaNotaId } from '../models/notas.js';

const router = Router();

router.get('/', validarToken, requerirRol(['usuario', 'admin']), obtenerNotas);
router.post(
  '/',
  validarToken,
  requerirRol(['usuario', 'admin']),
  validarBody(esquemaCrearNota),
  crearNota,
);
router.get(
  '/:id',
  validarToken,
  requerirRol(['usuario', 'admin']),
  validarParams(esquemaNotaId),
  obtenerNota,
);
router.put(
  '/:id',
  validarToken,
  requerirRol(['usuario', 'admin']),
  validarParams(esquemaNotaId),
  validarBody(esquemaActualizarNota),
  editarNota,
);
router.delete(
  '/:id',
  validarToken,
  requerirRol(['admin']),
  validarParams(esquemaNotaId),
  borrarNotaControlador,
);

export default router;
