import prepararExpress from './express.js';
import { conectarMongo } from './mongo.js';

const iniciarApp = () => {
  const app = prepararExpress();
  return app;
};

export const iniciarSistema = async () => {
  await conectarMongo();
  const app = iniciarApp();
  return { app };
};

export default iniciarApp;
