import request from 'supertest';
import {
  guardarEntorno,
  restaurarEntorno,
  prepararApp,
  headersBasicos,
  obtenerTokenDemo,
  cerrarMongo,
} from '../helpers/integracion.js';

const adminUsuario = () => process.env.ADMIN_USER || 'admin';
const tokenValido = obtenerTokenDemo();

describe('rutas de seguridad', () => {
  const entornoOriginal = guardarEntorno();
  let app;

  const headersUsuario = () => headersBasicos('usuario');
  const headersAdmin = () => headersBasicos('admin', { 'x-usuario': adminUsuario() });

  beforeAll(async () => {
    process.env.MONGO_URI = 'mongodb://localhost:27017/noteedit_test_ruta_seguridad';
    app = await prepararApp();
  });

  afterAll(async () => {
    await cerrarMongo();
    restaurarEntorno(entornoOriginal);
  });

  test('public no requiere token', async () => {
    const res = await request(app).get('/public');
    expect(res.status).toBe(200);
    expect(res.body?.mensaje).toBeTruthy();
  });

  test('vip requiere token y rol', async () => {
    const res = await request(app)
      .get('/vip')
      .set(headersUsuario());
    expect(res.status).toBe(200);
    expect(res.body?.rol).toBe('usuario');
  });

  test('vip rechaza token inválido (403)', async () => {
    const res = await request(app)
      .get('/vip')
      .set('Authorization', 'Bearer $2b$10$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
      .set('x-rol', 'usuario');
    expect(res.status).toBe(403);
  });

  test('vip acepta token por x-token', async () => {
    const res = await request(app)
      .get('/vip')
      .set('x-token', tokenValido)
      .set('x-rol', 'usuario');
    expect(res.status).toBe(200);
  });

  test('vip rechaza token mal formado (403)', async () => {
    const res = await request(app)
      .get('/vip')
      .set('Authorization', 'Bearer invalido')
      .set('x-rol', 'usuario');
    expect(res.status).toBe(403);
    expect(res.body?.mensaje).toBe('token invalido');
  });

  test('admin requiere usuario admin y rol admin', async () => {
    const res = await request(app)
      .get('/admin')
      .set(headersAdmin());
    expect(res.status).toBe(200);
    expect(res.body?.usuario).toBe(adminUsuario());
  });

  test('admin rechaza usuario no válido (403)', async () => {
    const headers = headersBasicos('admin', { 'x-usuario': 'otro' });
    const res = await request(app)
      .get('/admin')
      .set(headers);
    expect(res.status).toBe(403);
  });

  test('admin rechaza rol no permitido (403)', async () => {
    const headers = headersBasicos('usuario', { 'x-usuario': adminUsuario() });
    const res = await request(app)
      .get('/admin')
      .set(headers);
    expect(res.status).toBe(403);
  });

  test('admin rechaza sin usuario (401)', async () => {
    const headers = headersBasicos('admin');
    delete headers['x-usuario'];
    const res = await request(app)
      .get('/admin')
      .set(headers);
    expect(res.status).toBe(401);
  });

  test('admin rechaza sin rol (401)', async () => {
    const headers = headersAdmin();
    delete headers['x-rol'];
    const res = await request(app)
      .get('/admin')
      .set(headers);
    expect(res.status).toBe(401);
  });

  test('admin rechaza sin token (401)', async () => {
    const headers = { 'x-rol': 'admin', 'x-usuario': adminUsuario() };
    const res = await request(app)
      .get('/admin')
      .set(headers);
    expect(res.status).toBe(401);
  });

  test('api-docs responde html', async () => {
    const res = await request(app).get('/api-docs');
    expect([200, 301]).toContain(res.status);
  });

  test('api-docs.json responde con spec', async () => {
    const res = await request(app).get('/api-docs.json');
    expect(res.status).toBe(200);
    expect(res.body?.openapi).toBeTruthy();
  });

  test('page y error devuelven html', async () => {
    const page = await request(app).get('/page');
    expect(page.status).toBe(200);
    const err = await request(app).get('/error');
    expect(err.status).toBe(404);
  });

  test('ruta inexistente devuelve 404 json', async () => {
    const res = await request(app).get('/ruta-inexistente');
    expect(res.status).toBe(404);
    expect(res.body?.mensaje).toBe('ruta no encontrada');
  });
});
