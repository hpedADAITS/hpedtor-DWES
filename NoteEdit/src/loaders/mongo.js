import mongoose from 'mongoose';
import config from '../config.js';
import { logger } from '../utils/index.js';

export const conectarMongo = async () => {
  if (!config.mongoHabilitado) return null;
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  try {
    await mongoose.connect(config.mongoUri);
    logger.info('mongo conectado');
    return mongoose.connection;
  } catch (err) {
    logger.error(`mongo fallo al conectar: ${err?.message || err}`);
    throw err;
  }
};
