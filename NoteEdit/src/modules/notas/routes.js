import { Router } from 'express';
import {
  obtenerNotas,
  crearNota,
  obtenerNota,
  editarNota,
  borrarNotaControlador,
  importarNotas,
  exportarNotas,
  exportarNotaArchivo,
} from './controller.js';
import {
  validarToken,
  requerirRol,
  validarBody,
  validarParams,
  validarQuery,
  validarAdminUsuario,
} from '../../core/middlewares/index.js';
import {
  esquemaActualizarNota,
  esquemaCrearNota,
  esquemaImportarNotas,
  esquemaListarNotasQuery,
  esquemaNotaId,
} from './models/dto.js';

const router = Router();

router.get(
  '/',
  validarToken,
  requerirRol(['usuario', 'admin']),
  validarQuery(esquemaListarNotasQuery),
  obtenerNotas,
);

router.get(
  '/exportar',
  validarToken,
  requerirRol(['usuario', 'admin']),
  validarQuery(esquemaListarNotasQuery),
  exportarNotas,
);

router.post(
  '/importar',
  validarToken,
  requerirRol(['usuario', 'admin']),
  validarBody(esquemaImportarNotas),
  importarNotas,
);
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
router.get(
  '/:id/archivo',
  validarToken,
  requerirRol(['usuario', 'admin']),
  validarParams(esquemaNotaId),
  exportarNotaArchivo,
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
  validarAdminUsuario,
  validarParams(esquemaNotaId),
  borrarNotaControlador,
);

export default router;
