export const accesoPublico = (req, res) => res.json({
  mensaje: 'nota publica de ejemplo, no requiere token',
  uso: 'sirve para probar el entorno antes de pedir notas reales',
});

export const accesoVip = (req, res) => res.json({
  mensaje: 'acceso autenticado a notas',
  alcance: 'lectura y edicion basica',
  rol: req.rol || 'desconocido',
});

export const accesoAdmin = (req, res) => res.json({
  mensaje: 'acceso total a notas',
  alcance: 'crear, editar y borrar',
  rol: req.rol || 'admin',
  usuario: req.headers['x-usuario'],
});
