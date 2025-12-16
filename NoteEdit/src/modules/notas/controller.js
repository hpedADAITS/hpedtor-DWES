import {
  listarNotasPaginadas,
  crearNotaNueva,
  buscarNota,
  actualizarNota,
  borrarNota,
} from './service.js';

export const obtenerNotas = async (req, res, next) => {
  try {
    const query = req.queryValidada || req.query || {};
    const { items, meta } = await listarNotasPaginadas(query);
    return res.json({ datos: items, meta });
  } catch (err) {
    return next(err);
  }
};

const normalizarNombreArchivo = (texto) => (
  (texto || 'nota')
    .toString()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 64)
);

export const crearNota = async (req, res, next) => {
  try {
    const { titulo, contenido, categoria } = req.body || {};
    const nueva = await crearNotaNueva({ titulo, contenido: contenido || '', categoria });
    return res.status(201).json({ datos: nueva });
  } catch (err) {
    return next(err);
  }
};

export const obtenerNota = async (req, res, next) => {
  try {
    const { id } = req.params;
    const nota = await buscarNota(id);
    if (!nota) return res.status(404).json({ mensaje: 'nota no encontrada' });
    return res.json({ datos: nota });
  } catch (err) {
    return next(err);
  }
};

export const editarNota = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { titulo, contenido, categoria } = req.body || {};
    const nota = await actualizarNota(id, { titulo, contenido, categoria });
    if (!nota) return res.status(404).json({ mensaje: 'nota no encontrada' });
    return res.json({ datos: nota });
  } catch (err) {
    return next(err);
  }
};

export const borrarNotaControlador = async (req, res, next) => {
  try {
    const { id } = req.params;
    const borrada = await borrarNota(id);
    if (!borrada) return res.status(404).json({ mensaje: 'nota no encontrada' });
    return res.json({ mensaje: 'nota eliminada' });
  } catch (err) {
    return next(err);
  }
};

export const importarNotas = async (req, res, next) => {
  try {
    const { archivos } = req.body || {};
    const creadas = await Promise.all(archivos.map((archivo) => crearNotaNueva({
      titulo: archivo.nombre,
      contenido: archivo.contenido || '',
      categoria: archivo.categoria || 'general',
    })));
    return res.status(201).json({ datos: creadas, total: creadas.length });
  } catch (err) {
    return next(err);
  }
};

export const exportarNotas = async (req, res, next) => {
  try {
    const query = req.queryValidada || req.query || {};
    const { items, meta } = await listarNotasPaginadas(query);
    const archivos = items.map((nota) => ({
      nombreArchivo: `${normalizarNombreArchivo(nota.titulo)}.note`,
      contenido: nota.contenido || '',
      categoria: nota.categoria || 'general',
      creadaEn: nota.creadaEn,
      actualizadaEn: nota.actualizadaEn,
      id: nota.id,
    }));
    return res.json({ datos: archivos, meta });
  } catch (err) {
    return next(err);
  }
};

export const exportarNotaArchivo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const nota = await buscarNota(id);
    if (!nota) return res.status(404).json({ mensaje: 'nota no encontrada' });

    const nombre = `${normalizarNombreArchivo(nota.titulo)}.note`;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${nombre}"`);
    return res.send(nota.contenido || '');
  } catch (err) {
    return next(err);
  }
};
