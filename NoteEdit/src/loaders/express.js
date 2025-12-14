import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rutas from '../routes/index.js';
import { loggerBasico } from '../middlewares/index.js';
import { logger } from '../utils/index.js';

const prepararExpress = () => {
  const app = express();
  app.use(express.json());
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(loggerBasico);
  app.use(rutas);

  app.use((req, res) => {
    res.status(404).json({ mensaje: 'ruta no encontrada' });
  });

  app.use((err, req, res, siguiente) => {
    logger.error(err?.message || err);
    Boolean(siguiente);
    res.status(500).send('Server Error');
  });

  return app;
};

export default prepararExpress;
