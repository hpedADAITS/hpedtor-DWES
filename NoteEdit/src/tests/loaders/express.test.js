import request from 'supertest';
import prepararExpress from '../../core/loaders/express.js';

describe('loader express', () => {
  test('responde 404 en ruta inexistente', async () => {
    const app = prepararExpress();
    const res = await request(app).get('/ruta-que-no-existe');
    expect(res.status).toBe(404);
  });
});
