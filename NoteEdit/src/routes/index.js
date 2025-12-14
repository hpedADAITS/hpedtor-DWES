import { Router } from 'express';
import usuariosRouter from './users.js';

const router = Router();

router.get('/ping', (req, res) => {
  res.send('pong');
});

router.use('/usuarios', usuariosRouter);

export default router;
