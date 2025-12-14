import request from 'supertest';
import app from '../../app.js';

describe('ruta usuarios', () => {
  test('devuelve listado basico', async () => {
    const res = await request(app).get('/usuarios');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.datos)).toBe(true);
  });
});
