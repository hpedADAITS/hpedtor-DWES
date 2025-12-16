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

describe('rutas de notas protegidas', () => {
  const entornoOriginal = guardarEntorno();
  let app;

  const headersUsuario = () => headersBasicos('usuario');
  const headersAdmin = () => headersBasicos('admin', { 'x-usuario': adminUsuario() });

  beforeAll(async () => {
    process.env.MONGO_URI = 'mongodb://localhost:27017/noteedit_test_rutas_basicas';
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

  test('rechaza sin token', async () => {
    const res = await request(app).get('/notas');
    expect(res.status).toBe(401);
  });

  test('crea nota con auth', async () => {
    const res = await request(app)
      .post('/notas')
      .set(headersUsuario())
      .send({ titulo: 'nota de test', contenido: 'texto' });
    expect(res.status).toBe(201);
    const notaId = res.body.datos.id;
    expect(res.body.datos.titulo).toBe('nota de test');

    const consulta = await request(app)
      .get(`/notas/${notaId}`)
      .set(headersUsuario());
    expect(consulta.status).toBe(200);
    expect(consulta.body?.datos?.contenido).toBe('texto');
  });

  test('edita nota con auth', async () => {
    const creada = await request(app)
      .post('/notas')
      .set(headersUsuario())
      .send({ titulo: 'nota inicial', contenido: 'texto' });
    const notaId = creada.body.datos.id;

    const res = await request(app)
      .put(`/notas/${notaId}`)
      .set(headersUsuario())
      .send({ titulo: 'nota editada' });
    expect(res.status).toBe(200);
    expect(res.body.datos.titulo).toBe('nota editada');
  });

  test('borra nota solo con admin', async () => {
    const creada = await request(app)
      .post('/notas')
      .set(headersUsuario())
      .send({ titulo: 'nota a borrar' });
    const notaId = creada.body.datos.id;

    const res = await request(app)
      .delete(`/notas/${notaId}`)
      .set(headersAdmin());
    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBe('nota eliminada');

    const res404 = await request(app)
      .get(`/notas/${notaId}`)
      .set(headersUsuario());
    expect(res404.status).toBe(404);
  });
});
