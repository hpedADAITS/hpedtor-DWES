import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import rutas from '../routes/index.js';
import swaggerSpec from '../docs/swagger.js';
import { loggerBasico, rutaNoEncontrada, manejarErrores } from '../middlewares/index.js';

const prepararExpress = () => {
  const app = express();
  app.use(express.json());
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(loggerBasico);

  app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(rutas);

  app.use(rutaNoEncontrada);
  app.use(manejarErrores);

  return app;
};

export default prepararExpress;
