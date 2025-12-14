import request from 'supertest';
import app from '../../app.js';

describe('ruta ping', () => {
  test('responde pong', async () => {
    const res = await request(app).get('/ping');
    expect(res.status).toBe(200);
    expect(res.text).toBe('pong');
  });
});
