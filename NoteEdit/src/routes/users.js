import { Router } from 'express';
import { listarUsuarios } from '../controllers/users.js';

const router = Router();

router.get('/', listarUsuarios);

export default router;
