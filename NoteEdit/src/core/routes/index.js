import path from 'path';
import { Router } from 'express';
import notasRouter from '../../modules/notas/routes.js';
import seguridadRouter from '../../modules/seguridad/routes.js';
import horaRouter from '../../modules/hora/routes.js';
import usuariosRouter from '../../modules/usuarios/routes.js';

const router = Router();
const raiz = process.cwd();

router.get('/ping', (req, res) => {
  res.send('pong');
});

router.get('/page', (req, res) => {
  const archivo = path.join(raiz, 'src', 'core', 'views', 'page.html');
  res.sendFile(archivo);
});

router.get('/error', (req, res) => {
  const archivo = path.join(raiz, 'src', 'core', 'views', 'error.html');
  res.status(404).sendFile(archivo);
});

router.use('/usuarios', usuariosRouter);
router.use('/notas', notasRouter);
router.use('/hora', horaRouter);
router.use('/', seguridadRouter);

export default router;
