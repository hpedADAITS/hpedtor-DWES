import path from 'path';
import { Router } from 'express';
import usuariosRouter from './users.js';
import notasRouter from './notas.js';
import seguridadRouter from './seguridad.js';

const router = Router();
const raiz = process.cwd();

router.get('/ping', (req, res) => {
  res.send('pong');
});

router.get('/page', (req, res) => {
  const archivo = path.join(raiz, 'src', 'views', 'page.html');
  res.sendFile(archivo);
});

router.get('/error', (req, res) => {
  const archivo = path.join(raiz, 'src', 'views', 'error.html');
  res.status(404).sendFile(archivo);
});

router.use('/usuarios', usuariosRouter);
router.use('/notas', notasRouter);
router.use('/', seguridadRouter);

export default router;
