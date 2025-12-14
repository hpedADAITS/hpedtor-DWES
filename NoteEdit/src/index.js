import app from './app.js';
import config from './config.js';
import { logger } from './utils/index.js';
import { conectarMongo } from './loaders/mongo.js';

const { puerto } = config;

await conectarMongo();

app.listen(puerto, () => {
  logger.info(`servidor de notas escuchando en puerto ${puerto}`);
});
