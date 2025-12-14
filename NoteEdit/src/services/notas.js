import {
  listarNotasRepo,
  crearNotaRepo,
  buscarNotaRepo,
  actualizarNotaRepo,
  borrarNotaRepo,
  limpiarNotasRepo,
} from '../repositories/notas.js';

const normalizar = (texto) => (texto || '').toString().toLowerCase();

const obtenerTamano = (nota) => (
  (nota?.titulo?.length || 0)
  + (nota?.contenido?.length || 0)
  + ((nota?.categoria || 'general')?.length || 0)
);

const aplicarFiltros = (notas, query) => {
  let resultado = [...notas];

  if (query.tituloContiene) {
    const buscado = normalizar(query.tituloContiene);
    resultado = resultado.filter((nota) => normalizar(nota.titulo).includes(buscado));
  }

  if (query.contenidoContiene) {
    const buscado = normalizar(query.contenidoContiene);
    resultado = resultado.filter((nota) => normalizar(nota.contenido).includes(buscado));
  }

  if (query.categoria) {
    const buscado = normalizar(query.categoria);
    resultado = resultado.filter((nota) => normalizar(nota.categoria || 'general') === buscado);
  }

  if (query.creadaDesde) {
    const desde = Date.parse(query.creadaDesde);
    resultado = resultado.filter((nota) => Date.parse(nota.creadaEn) >= desde);
  }

  if (query.creadaHasta) {
    const hasta = Date.parse(query.creadaHasta);
    resultado = resultado.filter((nota) => Date.parse(nota.creadaEn) <= hasta);
  }

  if (query.actualizadaDesde) {
    const desde = Date.parse(query.actualizadaDesde);
    resultado = resultado.filter((nota) => Date.parse(nota.actualizadaEn) >= desde);
  }

  if (query.actualizadaHasta) {
    const hasta = Date.parse(query.actualizadaHasta);
    resultado = resultado.filter((nota) => Date.parse(nota.actualizadaEn) <= hasta);
  }

  return resultado;
};

const aplicarOrden = (notas, query) => {
  const factor = query.order === 'asc' ? 1 : -1;

  return [...notas].sort((a, b) => {
    if (query.sort === 'titulo') return a.titulo.localeCompare(b.titulo) * factor;
    if (query.sort === 'creadaEn') return (Date.parse(a.creadaEn) - Date.parse(b.creadaEn)) * factor;
    if (query.sort === 'actualizadaEn') {
      return (Date.parse(a.actualizadaEn) - Date.parse(b.actualizadaEn)) * factor;
    }
    if (query.sort === 'tamano') return (obtenerTamano(a) - obtenerTamano(b)) * factor;
    return 0;
  });
};

const aplicarPaginacion = (notas, query) => {
  const total = notas.length;
  const totalPaginas = total === 0 ? 0 : Math.ceil(total / query.limit);
  const inicio = (query.page - 1) * query.limit;
  const items = notas.slice(inicio, inicio + query.limit);

  return {
    items,
    meta: {
      total,
      totalPaginas,
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      order: query.order,
    },
  };
};

export const listarNotas = async () => listarNotasRepo();

export const listarNotasPaginadas = async (query) => {
  const notas = await listarNotasRepo();
  const filtradas = aplicarFiltros(notas, query);
  const ordenadas = aplicarOrden(filtradas, query);
  return aplicarPaginacion(ordenadas, query);
};

export const crearNotaNueva = async (payload) => crearNotaRepo(payload);

export const buscarNota = async (id) => buscarNotaRepo(id);

export const actualizarNota = async (id, cambios) => actualizarNotaRepo(id, cambios);

export const borrarNota = async (id) => borrarNotaRepo(id);

export const limpiarNotas = () => limpiarNotasRepo();
