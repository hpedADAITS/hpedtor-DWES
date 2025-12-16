import { Router } from 'express';
import { listarUsuarios } from './controller.js';

const router = Router();

router.get('/', listarUsuarios);

export default router;
