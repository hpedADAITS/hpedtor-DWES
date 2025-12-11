const servicios = require('../services');
const { paginacionItems } = require('../utils');

async function obtenerLibros(req, res) {
  try {
    const resultado = await servicios.obtenerLibros(req.query);
    const paginado = paginacionItems(req, resultado, req.query.offset || 0, req.query.limit || 5);
    return res.json(paginado);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function obtenerLibroId(req, res) {
  try {
    const { id } = req.params;
    const libro = await servicios.obtenerLibroId(id);
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    return res.json(libro);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function crearLibro(req, res) {
  try {
    const libro = await servicios.crearLibro(req.body);
    return res.status(201).json(libro);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function actualizarLibro(req, res) {
  try {
    const { id } = req.params;
    const libro = await servicios.actualizarLibro(id, req.body);
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    return res.json(libro);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function eliminarLibro(req, res) {
  try {
    const { id } = req.params;
    const libro = await servicios.eliminarLibro(id);
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    return res.json({ mensaje: 'Libro eliminado', libro });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  obtenerLibros,
  obtenerLibroId,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
};
