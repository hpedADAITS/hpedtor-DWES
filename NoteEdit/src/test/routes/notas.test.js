import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../../app.js';
import config from '../../config.js';

const tokenValido = bcrypt.hashSync('I know your secret', 10);

const headersUsuario = {
  Authorization: `Bearer ${tokenValido}`,
  'x-rol': 'usuario',
};

const headersAdmin = {
  Authorization: `Bearer ${tokenValido}`,
  'x-rol': 'admin',
  'x-usuario': config.adminUsuario,
};

describe('rutas de notas protegidas', () => {
  let notaId;

  beforeAll(() => {
    // evitar interferencias entre ejecuciones
    headersUsuario['x-rol'] = 'usuario';
    headersAdmin['x-rol'] = 'admin';
  });

  test('rechaza sin token', async () => {
    const res = await request(app).get('/notas');
    expect(res.status).toBe(401);
  });

  test('crea nota con auth', async () => {
    const res = await request(app)
      .post('/notas')
      .set(headersUsuario)
      .send({ titulo: 'nota de test', contenido: 'texto' });
    expect(res.status).toBe(201);
    notaId = res.body.datos.id;
    expect(res.body.datos.titulo).toBe('nota de test');
  });

  test('edita nota con auth', async () => {
    const res = await request(app)
      .put(`/notas/${notaId}`)
      .set(headersUsuario)
      .send({ titulo: 'nota editada' });
    expect(res.status).toBe(200);
    expect(res.body.datos.titulo).toBe('nota editada');
  });

  test('borra nota solo con admin', async () => {
    const res = await request(app)
      .delete(`/notas/${notaId}`)
      .set(headersAdmin);
    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBe('nota eliminada');
  });
});
