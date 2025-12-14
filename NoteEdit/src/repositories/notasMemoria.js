const notasMemoria = [];

const generarId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

export const listarNotasMemoria = () => notasMemoria;

export const crearNotaMemoria = ({ titulo, contenido = '', categoria = 'general' }) => {
  const nueva = {
    id: generarId(),
    titulo,
    contenido,
    categoria,
    creadaEn: new Date().toISOString(),
    actualizadaEn: new Date().toISOString(),
  };
  notasMemoria.push(nueva);
  return nueva;
};

export const buscarNotaMemoria = (id) => notasMemoria.find((nota) => nota.id === id);

export const actualizarNotaMemoria = (id, cambios) => {
  const nota = notasMemoria.find((item) => item.id === id);
  if (!nota) return null;
  if (cambios.titulo !== undefined) nota.titulo = cambios.titulo;
  if (cambios.contenido !== undefined) nota.contenido = cambios.contenido;
  if (cambios.categoria !== undefined) nota.categoria = cambios.categoria;
  nota.actualizadaEn = new Date().toISOString();
  return nota;
};

export const borrarNotaMemoria = (id) => {
  const indice = notasMemoria.findIndex((item) => item.id === id);
  if (indice === -1) return false;
  notasMemoria.splice(indice, 1);
  return true;
};

export const limpiarNotasMemoria = () => {
  notasMemoria.splice(0, notasMemoria.length);
};
