const express = require('express');
const controlador = require('../controllers/users');

const router = express.Router();

router.get('/', controlador.obtenerLibros);
router.get('/:id', controlador.obtenerLibroId);
router.post('/', controlador.crearLibro);
router.put('/:id', controlador.actualizarLibro);
router.delete('/:id', controlador.eliminarLibro);

module.exports = router;
