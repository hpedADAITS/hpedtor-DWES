import config from './core/config/index.js';
import { logger } from './core/utils/index.js';
import { iniciarSistema } from './core/loaders/index.js';

const { puerto } = config;

const { app } = await iniciarSistema();

app.listen(puerto, () => {
  logger.info(`servidor de notas escuchando en puerto ${puerto}`);
});
