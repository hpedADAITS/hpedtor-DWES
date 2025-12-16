import { Router } from 'express';
import { obtenerHora } from './controller.js';

const router = Router();

router.get('/', obtenerHora);

export default router;
