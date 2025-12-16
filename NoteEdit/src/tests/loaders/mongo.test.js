import { jest } from '@jest/globals';

const entornoOriginal = { ...process.env };

const reimportar = async () => {
  jest.resetModules();
  return import('../../core/loaders/mongo.js');
};

describe('loader mongo', () => {
  afterAll(() => {
    process.env = { ...entornoOriginal };
  });

  test('devuelve null cuando mongo está deshabilitado', async () => {
    process.env.MONGO_ENABLED = 'false';
    process.env.NODE_ENV = 'integration';
    const { conectarMongo } = await reimportar();
    const res = await conectarMongo();
    expect(res).toBeNull();
  });

  test('conecta y reutiliza la conexión real', async () => {
    process.env.MONGO_ENABLED = 'true';
    process.env.NODE_ENV = 'integration';
    process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/noteedit';
    const { conectarMongo } = await reimportar();
    const conn1 = await conectarMongo();
    expect(conn1?.readyState).toBe(1);
    // Segunda llamada debe reutilizar la conexión
    const conn2 = await conectarMongo();
    expect(conn2?.readyState).toBe(1);
    expect(conn1).toBe(conn2);
  });

  test('lanza error cuando la conexión a mongo falla', async () => {
    process.env.MONGO_ENABLED = 'true';
    process.env.MONGO_URI = 'mongodb://invalid-host:27017/noteedit';
    const { conectarMongo } = await reimportar();
    await expect(conectarMongo()).rejects.toThrow();
  });
});
