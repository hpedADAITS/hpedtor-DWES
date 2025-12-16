import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from '@jest/globals';

const uriDefecto = 'mongodb://localhost:27017/noteedit';

export const guardarEntorno = () => ({ ...process.env });

export const restaurarEntorno = (respaldo) => {
  process.env = { ...respaldo };
};

export const forzarEntornoReal = () => {
  process.env.NODE_ENV = 'integration';
  process.env.MONGO_ENABLED = 'true';
  process.env.MONGO_URI = process.env.MONGO_URI || uriDefecto;
};

export const prepararApp = async () => {
  forzarEntornoReal();
  jest.resetModules();
  const { iniciarSistema } = await import('../../core/loaders/index.js');
  const { app } = await iniciarSistema();
  return app;
};

export const limpiarNotasMongo = async () => {
  if (mongoose.connection.readyState === 0) return;
  const { NotaMongo } = await import('../../modules/notas/models/schema.js');
  await NotaMongo.deleteMany({});
};

let tokenCache;

export const obtenerTokenDemo = () => {
  if (!tokenCache) {
    tokenCache = bcrypt.hashSync('I know your secret', 10);
  }
  return tokenCache;
};

export const headersBasicos = (rol = 'usuario', extras = {}) => ({
  Authorization: `Bearer ${obtenerTokenDemo()}`,
  'x-rol': rol,
  ...extras,
});

export const cerrarMongo = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};
