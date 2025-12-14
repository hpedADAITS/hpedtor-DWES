const notasMemoria = [];

const generarId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

export const listarNotasRepo = () => notasMemoria;

export const crearNotaRepo = ({ titulo, contenido = '' }) => {
  const nueva = {
    id: generarId(),
    titulo,
    contenido,
    creadaEn: new Date().toISOString(),
    actualizadaEn: new Date().toISOString(),
  };
  notasMemoria.push(nueva);
  return nueva;
};

export const buscarNotaRepo = (id) => notasMemoria.find((nota) => nota.id === id);

export const actualizarNotaRepo = (id, cambios) => {
  const nota = notasMemoria.find((item) => item.id === id);
  if (!nota) return null;
  if (cambios.titulo) nota.titulo = cambios.titulo;
  if (cambios.contenido) nota.contenido = cambios.contenido;
  nota.actualizadaEn = new Date().toISOString();
  return nota;
};

export const borrarNotaRepo = (id) => {
  const indice = notasMemoria.findIndex((item) => item.id === id);
  if (indice === -1) return false;
  notasMemoria.splice(indice, 1);
  return true;
};
