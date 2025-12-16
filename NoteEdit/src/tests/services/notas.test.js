import { jest } from '@jest/globals';
import {
  guardarEntorno,
  restaurarEntorno,
  forzarEntornoReal,
  cerrarMongo,
} from '../helpers/integracion.js';

const cargarServicios = async () => {
  forzarEntornoReal();
  jest.resetModules();
  const { conectarMongo } = await import('../../core/loaders/mongo.js');
  await conectarMongo();
  return import('../../modules/notas/service.js');
};

describe('servicio notas', () => {
  const entornoOriginal = guardarEntorno();
  let servicios;

  beforeAll(async () => {
    process.env.MONGO_URI = 'mongodb://localhost:27017/noteedit_test_servicios_notas';
    servicios = await cargarServicios();
    await servicios.limpiarNotas();
  });

  beforeEach(async () => {
    await servicios.limpiarNotas();
  });

  afterAll(async () => {
    await servicios.limpiarNotas();
    await cerrarMongo();
    restaurarEntorno(entornoOriginal);
  });

  test('crea y recupera nota', async () => {
    const creada = await servicios.crearNotaNueva({ titulo: 'nota servicio', contenido: 'contenido' });
    const hallada = await servicios.buscarNota(creada.id);
    expect(hallada?.titulo).toBe('nota servicio');
  });

  test('actualiza y borra nota', async () => {
    const creada = await servicios.crearNotaNueva({ titulo: 'nota a borrar', contenido: 'algo' });
    const actualizada = await servicios.actualizarNota(creada.id, { titulo: 'nota cambiada' });
    expect(actualizada?.titulo).toBe('nota cambiada');
    const borrada = await servicios.borrarNota(creada.id);
    expect(borrada).toBe(true);
  });

  test('lista todas las notas', async () => {
    await servicios.crearNotaNueva({ titulo: 'nota 1', contenido: 'contenido 1' });
    await servicios.crearNotaNueva({ titulo: 'nota 2', contenido: 'contenido 2' });
    const notas = await servicios.listarNotas();
    expect(notas.length).toBe(2);
  });

  test('lista notas paginadas sin filtros', async () => {
    await servicios.crearNotaNueva({ titulo: 'nota 1', contenido: 'contenido 1' });
    await servicios.crearNotaNueva({ titulo: 'nota 2', contenido: 'contenido 2' });
    const resultado = await servicios.listarNotasPaginadas({
      page: 1,
      limit: 10,
      sort: 'titulo',
      order: 'asc',
    });
    expect(resultado.items.length).toBe(2);
    expect(resultado.meta.total).toBe(2);
    expect(resultado.meta.page).toBe(1);
  });

  test('filtra notas por titulo', async () => {
    await servicios.crearNotaNueva({ titulo: 'javascript', contenido: 'lenguaje' });
    await servicios.crearNotaNueva({ titulo: 'python', contenido: 'lenguaje' });
    const resultado = await servicios.listarNotasPaginadas({
      page: 1,
      limit: 10,
      sort: 'titulo',
      order: 'asc',
      tituloContiene: 'java',
    });
    expect(resultado.items.length).toBe(1);
    expect(resultado.items[0].titulo).toBe('javascript');
  });

  test('filtra notas por contenido', async () => {
    await servicios.crearNotaNueva({ titulo: 'nota 1', contenido: 'importante' });
    await servicios.crearNotaNueva({ titulo: 'nota 2', contenido: 'normal' });
    const resultado = await servicios.listarNotasPaginadas({
      page: 1,
      limit: 10,
      sort: 'titulo',
      order: 'asc',
      contenidoContiene: 'importante',
    });
    expect(resultado.items.length).toBe(1);
  });

  test('filtra notas por categoria', async () => {
    await servicios.crearNotaNueva({ titulo: 'nota 1', contenido: 'algo', categoria: 'trabajo' });
    await servicios.crearNotaNueva({ titulo: 'nota 2', contenido: 'algo', categoria: 'personal' });
    const resultado = await servicios.listarNotasPaginadas({
      page: 1,
      limit: 10,
      sort: 'titulo',
      order: 'asc',
      categoria: 'trabajo',
    });
    expect(resultado.items.length).toBe(1);
    expect(resultado.items[0].categoria).toBe('trabajo');
  });

  test('ordena notas ascendente por titulo', async () => {
    await servicios.crearNotaNueva({ titulo: 'zeta', contenido: 'algo' });
    await servicios.crearNotaNueva({ titulo: 'alfa', contenido: 'algo' });
    const resultado = await servicios.listarNotasPaginadas({
      page: 1,
      limit: 10,
      sort: 'titulo',
      order: 'asc',
    });
    expect(resultado.items[0].titulo).toBe('alfa');
    expect(resultado.items[1].titulo).toBe('zeta');
  });

  test('ordena notas descendente por titulo', async () => {
    await servicios.crearNotaNueva({ titulo: 'zeta', contenido: 'algo' });
    await servicios.crearNotaNueva({ titulo: 'alfa', contenido: 'algo' });
    const resultado = await servicios.listarNotasPaginadas({
      page: 1,
      limit: 10,
      sort: 'titulo',
      order: 'desc',
    });
    expect(resultado.items[0].titulo).toBe('zeta');
    expect(resultado.items[1].titulo).toBe('alfa');
  });

  test('ordena por tamaño', async () => {
    await servicios.crearNotaNueva({ titulo: 'a', contenido: 'contenido muy largo xxxxx' });
    await servicios.crearNotaNueva({ titulo: 'nota grande', contenido: 'a' });
    const resultado = await servicios.listarNotasPaginadas({
      page: 1,
      limit: 10,
      sort: 'tamano',
      order: 'asc',
    });
    expect(resultado.items.length).toBe(2);
  });

  test('ordena por fecha creacion', async () => {
    const nota1 = await servicios.crearNotaNueva({ titulo: 'nota 1', contenido: 'algo' });
    await new Promise((resolve) => {
      setTimeout(resolve, 10);
    });
    const nota2 = await servicios.crearNotaNueva({ titulo: 'nota 2', contenido: 'algo' });
    const resultado = await servicios.listarNotasPaginadas({
      page: 1,
      limit: 10,
      sort: 'creadaEn',
      order: 'asc',
    });
    expect(resultado.items[0].id).toBe(nota1.id);
    expect(resultado.items[1].id).toBe(nota2.id);
  });

  test('pagina resultados correctamente', async () => {
    await Promise.all(
      Array.from({ length: 15 }, (_, i) => servicios.crearNotaNueva({ titulo: `nota ${i}`, contenido: 'algo' })),
    );
    const resultado = await servicios.listarNotasPaginadas({
      page: 2,
      limit: 5,
      sort: 'titulo',
      order: 'asc',
    });
    expect(resultado.items.length).toBe(5);
    expect(resultado.meta.totalPaginas).toBe(3);
    expect(resultado.meta.page).toBe(2);
  });

  test('filtra por rango de fechas creacion', async () => {
    const ahora = new Date();
    const hace1Hora = new Date(ahora.getTime() - 3600000);
    const dentro1Hora = new Date(ahora.getTime() + 3600000);

    await servicios.crearNotaNueva({ titulo: 'nota reciente', contenido: 'algo' });
    const resultado = await servicios.listarNotasPaginadas({
      page: 1,
      limit: 10,
      sort: 'titulo',
      order: 'asc',
      creadaDesde: hace1Hora.toISOString(),
      creadaHasta: dentro1Hora.toISOString(),
    });
    expect(resultado.items.length).toBe(1);
  });

  test('combina multiples filtros', async () => {
    await servicios.crearNotaNueva({ titulo: 'javascript tutorial', contenido: 'aprender', categoria: 'trabajo' });
    await servicios.crearNotaNueva({ titulo: 'python basics', contenido: 'aprender', categoria: 'trabajo' });
    await servicios.crearNotaNueva({ titulo: 'javascript avanzado', contenido: 'proyecto', categoria: 'personal' });

    const resultado = await servicios.listarNotasPaginadas({
      page: 1,
      limit: 10,
      sort: 'titulo',
      order: 'asc',
      tituloContiene: 'javascript',
      contenidoContiene: 'aprender',
      categoria: 'trabajo',
    });
    expect(resultado.items.length).toBe(1);
    expect(resultado.items[0].titulo).toBe('javascript tutorial');
  });
});
