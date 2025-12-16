import request from 'supertest';
import {
  guardarEntorno,
  restaurarEntorno,
  prepararApp,
  cerrarMongo,
} from '../helpers/integracion.js';

describe('ruta usuarios', () => {
  const entornoOriginal = guardarEntorno();
  let app;

  beforeAll(async () => {
    process.env.MONGO_URI = 'mongodb://localhost:27017/noteedit_test_ruta_usuarios';
    app = await prepararApp();
  });

  afterAll(async () => {
    await cerrarMongo();
    restaurarEntorno(entornoOriginal);
  });

  test('devuelve listado basico', async () => {
    const res = await request(app).get('/usuarios');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.datos)).toBe(true);
  });
});
