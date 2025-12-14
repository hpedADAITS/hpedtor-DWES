import { leerUsuarios } from '../repositories/index.js';

export * from './notas.js';

export const obtenerUsuarios = () => leerUsuarios();
