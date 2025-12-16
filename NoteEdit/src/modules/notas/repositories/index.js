import config from '../../../core/config/index.js';
import {
  listarNotasMemoria,
  crearNotaMemoria,
  buscarNotaMemoria,
  actualizarNotaMemoria,
  borrarNotaMemoria,
  limpiarNotasMemoria,
} from './memoria.js';
import {
  listarNotasMongo,
  crearNotaMongo,
  buscarNotaMongo,
  actualizarNotaMongo,
  borrarNotaMongo,
  limpiarNotasMongo,
} from './mongo.js';

const usarMongo = () => Boolean(config.mongoHabilitado);

export const listarNotasRepo = async () => (
  usarMongo() ? listarNotasMongo() : listarNotasMemoria()
);

export const crearNotaRepo = async (payload) => (
  usarMongo() ? crearNotaMongo(payload) : crearNotaMemoria(payload)
);

export const buscarNotaRepo = async (id) => (
  usarMongo() ? buscarNotaMongo(id) : buscarNotaMemoria(id)
);

export const actualizarNotaRepo = async (id, cambios) => (
  usarMongo() ? actualizarNotaMongo(id, cambios) : actualizarNotaMemoria(id, cambios)
);

export const borrarNotaRepo = async (id) => (
  usarMongo() ? borrarNotaMongo(id) : borrarNotaMemoria(id)
);

export const limpiarNotasRepo = async () => {
  if (usarMongo()) {
    await limpiarNotasMongo();
    return;
  }
  limpiarNotasMemoria();
};
