import request from 'supertest';
import {
  guardarEntorno,
  restaurarEntorno,
  prepararApp,
  headersBasicos,
  limpiarNotasMongo,
  cerrarMongo,
} from '../helpers/integracion.js';

const adminUsuario = () => process.env.ADMIN_USER || 'admin';

describe('controlador notas', () => {
  const entornoOriginal = guardarEntorno();
  let app;

  const headersUsuario = () => headersBasicos('usuario');
  const headersAdmin = () => headersBasicos('admin', { 'x-usuario': adminUsuario() });

  beforeAll(async () => {
    process.env.MONGO_URI = 'mongodb://localhost:27017/noteedit_test_ctrl_notas';
    app = await prepararApp();
    await limpiarNotasMongo();
  });

  beforeEach(async () => {
    await limpiarNotasMongo();
  });

  afterAll(async () => {
    await limpiarNotasMongo();
    await cerrarMongo();
    restaurarEntorno(entornoOriginal);
  });

  test('obtener nota devuelve 404 si no existe', async () => {
    const res = await request(app)
      .get('/notas/nota-inexistente')
      .set(headersUsuario());

    expect(res.status).toBe(404);
    expect(res.body?.mensaje).toBe('nota no encontrada');
  });

  test('crea nota y la recupera', async () => {
    const creada = await request(app)
      .post('/notas')
      .set(headersUsuario())
      .send({ titulo: 'nota real', contenido: 'texto real' });

    const notaId = creada.body?.datos?.id;
    expect(creada.status).toBe(201);
    expect(notaId).toBeTruthy();

    const respuesta = await request(app)
      .get(`/notas/${notaId}`)
      .set(headersUsuario());

    expect(respuesta.status).toBe(200);
    expect(respuesta.body?.datos?.titulo).toBe('nota real');
  });

  test('exporta nota como archivo .note', async () => {
    const creada = await request(app)
      .post('/notas')
      .set(headersUsuario())
      .send({ titulo: 'nota exportable', contenido: 'contenido exportable' });
    const notaId = creada.body?.datos?.id;

    const respuesta = await request(app)
      .get(`/notas/${notaId}/archivo`)
      .set(headersUsuario());

    expect(respuesta.status).toBe(200);
    expect(respuesta.headers['content-type']).toContain('text/plain');
    expect(respuesta.text).toContain('contenido exportable');
  });

  test('borra nota con admin real', async () => {
    const creada = await request(app)
      .post('/notas')
      .set(headersUsuario())
      .send({ titulo: 'nota admin' });

    const respuesta = await request(app)
      .delete(`/notas/${creada.body?.datos?.id}`)
      .set(headersAdmin());

    expect(respuesta.status).toBe(200);
    expect(respuesta.body?.mensaje).toBe('nota eliminada');
  });

  test('actualiza nota existente', async () => {
    const creada = await request(app)
      .post('/notas')
      .set(headersUsuario())
      .send({ titulo: 'original', contenido: 'contenido original' });
    const notaId = creada.body?.datos?.id;

    const respuesta = await request(app)
      .put(`/notas/${notaId}`)
      .set(headersUsuario())
      .send({ titulo: 'actualizado', contenido: 'contenido actualizado' });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body?.datos?.titulo).toBe('actualizado');
  });

  test('retorna 401 si no hay token para crear nota', async () => {
    const respuesta = await request(app)
      .post('/notas')
      .send({ titulo: 'sin auth', contenido: 'algo' });

    expect(respuesta.status).toBe(401);
  });

  test('obtiene lista de notas con meta información', async () => {
    // Crear múltiples notas
    await request(app)
      .post('/notas')
      .set(headersUsuario())
      .send({ titulo: 'nota 1', contenido: 'contenido 1' });

    await request(app)
      .post('/notas')
      .set(headersUsuario())
      .send({ titulo: 'nota 2', contenido: 'contenido 2' });

    const respuesta = await request(app)
      .get('/notas')
      .set(headersUsuario());

    expect(respuesta.status).toBe(200);
    expect(Array.isArray(respuesta.body?.datos)).toBe(true);
    expect(respuesta.body?.datos?.length).toBeGreaterThan(0);
    expect(respuesta.body?.meta).toBeDefined();
  });

  test('obtiene lista paginada con query parameters', async () => {
    // Crear varias notas
    await Promise.all(
      Array.from({ length: 5 }, (_, i) => request(app)
        .post('/notas')
        .set(headersUsuario())
        .send({ titulo: `nota ${i}`, contenido: `contenido ${i}` })),
    );

    const respuesta = await request(app)
      .get('/notas?page=1&limit=2')
      .set(headersUsuario());

    expect(respuesta.status).toBe(200);
    expect(Array.isArray(respuesta.body?.datos)).toBe(true);
    expect(respuesta.body?.meta?.page).toBe(1);
    expect(respuesta.body?.meta?.limit).toBe(2);
  });

  test('importa múltiples notas desde archivos', async () => {
    const respuesta = await request(app)
      .post('/notas/importar')
      .set(headersUsuario())
      .send({
        archivos: [
          { nombre: 'archivo1.txt', contenido: 'contenido1', categoria: 'trabajo' },
          { nombre: 'archivo2.txt', contenido: 'contenido2', categoria: 'personal' },
        ],
      });

    expect(respuesta.status).toBe(201);
    expect(Array.isArray(respuesta.body?.datos)).toBe(true);
    expect(respuesta.body?.datos?.length).toBe(2);
    expect(respuesta.body?.total).toBe(2);
  });

  test('importa notas sin contenido ni categoría', async () => {
    const respuesta = await request(app)
      .post('/notas/importar')
      .set(headersUsuario())
      .send({
        archivos: [
          { nombre: 'archivo.txt' },
        ],
      });

    expect(respuesta.status).toBe(201);
    expect(respuesta.body?.datos[0].contenido).toBe('');
    expect(respuesta.body?.datos[0].categoria).toBe('general');
  });

  test('exporta lista de notas en formato archivo', async () => {
    // Crear notas
    await request(app)
      .post('/notas')
      .set(headersUsuario())
      .send({ titulo: 'nota a exportar', contenido: 'contenido a exportar' });

    const respuesta = await request(app)
      .get('/notas/exportar')
      .set(headersUsuario());

    expect(respuesta.status).toBe(200);
    expect(Array.isArray(respuesta.body?.datos)).toBe(true);
    expect(respuesta.body?.datos[0]?.nombreArchivo).toMatch(/\.note$/);
    expect(respuesta.body?.meta).toBeDefined();
  });

  test('exporta nota individual como archivo con headers', async () => {
    const creada = await request(app)
      .post('/notas')
      .set(headersUsuario())
      .send({ titulo: 'Mi Nota!@#$', contenido: 'contenido especial' });
    const notaId = creada.body?.datos?.id;

    const respuesta = await request(app)
      .get(`/notas/${notaId}/archivo`)
      .set(headersUsuario());

    expect(respuesta.status).toBe(200);
    expect(respuesta.headers['content-type']).toContain('text/plain');
    expect(respuesta.headers['content-disposition']).toContain('attachment');
    expect(respuesta.headers['content-disposition']).toContain('.note');
    expect(respuesta.text).toBe('contenido especial');
  });

  test('exporta nota con titulo vacio', async () => {
    const creada = await request(app)
      .post('/notas')
      .set(headersUsuario())
      .send({ titulo: 'titulo', contenido: 'contenido' });
    const notaId = creada.body?.datos?.id;

    const respuesta = await request(app)
      .get(`/notas/${notaId}/archivo`)
      .set(headersUsuario());

    expect(respuesta.status).toBe(200);
    expect(respuesta.text).toBe('contenido');
  });

  test('normaliza nombre archivo con caracteres especiales', async () => {
    const creada = await request(app)
      .post('/notas')
      .set(headersUsuario())
      .send({ titulo: 'Mi-Nota_Especial!@#$', contenido: 'contenido' });
    const notaId = creada.body?.datos?.id;

    const respuesta = await request(app)
      .get(`/notas/${notaId}/archivo`)
      .set(headersUsuario());

    expect(respuesta.status).toBe(200);
    // Normalizador preserva guiones y guion bajo, elimina caracteres especiales
    expect(respuesta.headers['content-disposition']).toContain('Mi-Nota_Especial.note');
    expect(respuesta.headers['content-disposition']).toContain('attachment');
  });

  test('actualiza nota retorna 404 si no existe', async () => {
    const respuesta = await request(app)
      .put('/notas/nota-inexistente')
      .set(headersUsuario())
      .send({ titulo: 'nuevo titulo' });

    expect(respuesta.status).toBe(404);
    expect(respuesta.body?.mensaje).toBe('nota no encontrada');
  });

  test('borra nota retorna 404 si no existe', async () => {
    const respuesta = await request(app)
      .delete('/notas/nota-inexistente')
      .set(headersAdmin());

    expect(respuesta.status).toBe(404);
    expect(respuesta.body?.mensaje).toBe('nota no encontrada');
  });

  test('exporta nota como archivo retorna 404 si no existe', async () => {
    const respuesta = await request(app)
      .get('/notas/nota-inexistente/archivo')
      .set(headersUsuario());

    expect(respuesta.status).toBe(404);
    expect(respuesta.body?.mensaje).toBe('nota no encontrada');
  });
});
