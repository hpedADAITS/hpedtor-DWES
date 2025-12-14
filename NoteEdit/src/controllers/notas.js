import {
  listarNotas,
  crearNotaNueva,
  buscarNota,
  actualizarNota,
  borrarNota,
} from '../services/notas.js';

export const obtenerNotas = (req, res) => {
  const notas = listarNotas();
  res.json({ datos: notas });
};

export const crearNota = (req, res) => {
  const { titulo, contenido } = req.body || {};
  if (!titulo) return res.status(400).json({ mensaje: 'titulo requerido' });
  const nueva = crearNotaNueva({ titulo, contenido: contenido || '' });
  return res.status(201).json({ datos: nueva });
};

export const obtenerNota = (req, res) => {
  const { id } = req.params;
  const nota = buscarNota(id);
  if (!nota) return res.status(404).json({ mensaje: 'nota no encontrada' });
  return res.json({ datos: nota });
};

export const editarNota = (req, res) => {
  const { id } = req.params;
  const { titulo, contenido } = req.body || {};
  if (!titulo && !contenido) {
    return res.status(400).json({ mensaje: 'nada para actualizar' });
  }
  const nota = actualizarNota(id, { titulo, contenido });
  if (!nota) return res.status(404).json({ mensaje: 'nota no encontrada' });
  return res.json({ datos: nota });
};

export const borrarNotaControlador = (req, res) => {
  const { id } = req.params;
  const borrada = borrarNota(id);
  if (!borrada) return res.status(404).json({ mensaje: 'nota no encontrada' });
  return res.json({ mensaje: 'nota eliminada' });
};
