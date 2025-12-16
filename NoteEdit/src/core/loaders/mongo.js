import mongoose from 'mongoose';
import config from '../config/index.js';
import { logger } from '../utils/index.js';

export const conectarMongo = async () => {
  if (!config.mongoHabilitado) return null;
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });
    logger.info('mongo conectado');
    return mongoose.connection;
  } catch (err) {
    logger.error(`mongo falló: ${err?.message || err}`);
    throw err;
  }
};
