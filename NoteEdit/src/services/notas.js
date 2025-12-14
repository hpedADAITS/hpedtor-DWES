import {
  listarNotasRepo,
  crearNotaRepo,
  buscarNotaRepo,
  actualizarNotaRepo,
  borrarNotaRepo,
} from '../repositories/notas.js';

export const listarNotas = () => listarNotasRepo();

export const crearNotaNueva = (payload) => crearNotaRepo(payload);

export const buscarNota = (id) => buscarNotaRepo(id);

export const actualizarNota = (id, cambios) => actualizarNotaRepo(id, cambios);

export const borrarNota = (id) => borrarNotaRepo(id);
