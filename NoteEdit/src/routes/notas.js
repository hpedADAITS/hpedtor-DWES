import { Router } from 'express';
import {
  obtenerNotas,
  crearNota,
  obtenerNota,
  editarNota,
  borrarNotaControlador,
} from '../controllers/notas.js';

const router = Router();

router.get('/', obtenerNotas);
router.post('/', crearNota);
router.get('/:id', obtenerNota);
router.put('/:id', editarNota);
router.delete('/:id', borrarNotaControlador);

export default router;
