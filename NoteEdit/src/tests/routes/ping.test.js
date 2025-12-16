import request from 'supertest';
import {
  guardarEntorno,
  restaurarEntorno,
  prepararApp,
  cerrarMongo,
} from '../helpers/integracion.js';

describe('ruta ping', () => {
  const entornoOriginal = guardarEntorno();
  let app;

  beforeAll(async () => {
    process.env.MONGO_URI = 'mongodb://localhost:27017/noteedit_test_ruta_ping';
    app = await prepararApp();
  });

  afterAll(async () => {
    await cerrarMongo();
    restaurarEntorno(entornoOriginal);
  });

  test('responde pong', async () => {
    const res = await request(app).get('/ping');
    expect(res.status).toBe(200);
    expect(res.text).toBe('pong');
  });
});
