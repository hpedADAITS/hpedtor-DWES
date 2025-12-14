import {
  listarNotasPaginadas,
  crearNotaNueva,
  buscarNota,
  actualizarNota,
  borrarNota,
} from '../services/notas.js';

export const obtenerNotas = async (req, res) => {
  const { items, meta } = await listarNotasPaginadas(req.query || {});
  res.json({ datos: items, meta });
};

const normalizarNombreArchivo = (texto) => (
  (texto || 'nota')
    .toString()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 64)
);

export const crearNota = async (req, res) => {
  const { titulo, contenido, categoria } = req.body || {};
  const nueva = await crearNotaNueva({ titulo, contenido: contenido || '', categoria });
  return res.status(201).json({ datos: nueva });
};

export const obtenerNota = async (req, res) => {
  const { id } = req.params;
  const nota = await buscarNota(id);
  if (!nota) return res.status(404).json({ mensaje: 'nota no encontrada' });
  return res.json({ datos: nota });
};

export const editarNota = async (req, res) => {
  const { id } = req.params;
  const { titulo, contenido, categoria } = req.body || {};
  const nota = await actualizarNota(id, { titulo, contenido, categoria });
  if (!nota) return res.status(404).json({ mensaje: 'nota no encontrada' });
  return res.json({ datos: nota });
};

export const borrarNotaControlador = async (req, res) => {
  const { id } = req.params;
  const borrada = await borrarNota(id);
  if (!borrada) return res.status(404).json({ mensaje: 'nota no encontrada' });
  return res.json({ mensaje: 'nota eliminada' });
};

export const importarNotas = async (req, res) => {
  const { archivos } = req.body || {};
  const creadas = await Promise.all(archivos.map((archivo) => crearNotaNueva({
    titulo: archivo.nombre,
    contenido: archivo.contenido || '',
    categoria: archivo.categoria || 'general',
  })));
  return res.status(201).json({ datos: creadas, total: creadas.length });
};

export const exportarNotas = async (req, res) => {
  const { items, meta } = await listarNotasPaginadas(req.query || {});
  const archivos = items.map((nota) => ({
    nombreArchivo: `${normalizarNombreArchivo(nota.titulo)}.note`,
    contenido: nota.contenido || '',
    categoria: nota.categoria || 'general',
    creadaEn: nota.creadaEn,
    actualizadaEn: nota.actualizadaEn,
    id: nota.id,
  }));
  return res.json({ datos: archivos, meta });
};

export const exportarNotaArchivo = async (req, res) => {
  const { id } = req.params;
  const nota = await buscarNota(id);
  if (!nota) return res.status(404).json({ mensaje: 'nota no encontrada' });

  const nombre = `${normalizarNombreArchivo(nota.titulo)}.note`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${nombre}"`);
  return res.send(nota.contenido || '');
};
