import express from 'express';
import rutas from '../routes/index.js';
import { loggerBasico } from '../middlewares/index.js';

const prepararExpress = () => {
  const app = express();
  app.use(express.json());
  app.use(loggerBasico);
  app.use(rutas);

  app.use((req, res) => {
    res.status(404).json({ mensaje: 'ruta no encontrada' });
  });

  return app;
};

export default prepararExpress;
