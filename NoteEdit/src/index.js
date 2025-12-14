import app from './app.js';
import config from './config.js';
import { logger } from './utils/index.js';

const { puerto } = config;

app.listen(puerto, () => {
  logger.info(`servidor de notas escuchando en puerto ${puerto}`);
});
