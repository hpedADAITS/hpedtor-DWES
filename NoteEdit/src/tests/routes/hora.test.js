import request from 'supertest';
import { jest } from '@jest/globals';
import { iniciarServidorExpress } from '../helpers/httpServer.js';
import {
  guardarEntorno,
  restaurarEntorno,
  prepararApp,
  cerrarMongo,
} from '../helpers/integracion.js';

const entornoOriginal = guardarEntorno();

jest.setTimeout(10000);

const prepararAplicacionHora = async ({ configurar, baseExtra = '', zona = 'hora' }) => {
  const servidor = await iniciarServidorExpress(configurar);
  process.env.MONGO_URI = 'mongodb://localhost:27017/noteedit_test_ruta_hora';
  process.env.HORA_API_BASE = `${servidor.urlBase}${baseExtra}`;
  process.env.HORA_API_ZONA = zona;
  const app = await prepararApp();
  return { app, cerrar: servidor.cerrar };
};

describe('ruta hora', () => {
  afterEach(() => {
    restaurarEntorno(entornoOriginal);
  });

  afterAll(async () => {
    await cerrarMongo();
  });

  test('devuelve hora desde servicio externo', async () => {
    const { app, cerrar } = await prepararAplicacionHora({
      configurar: (router) => {
        router.get('/hora', (req, res) => {
          res.json({ datetime: '2025-01-01T10:00:00.000Z' });
        });
      },
    });

    try {
      const res = await request(app).get('/hora');
      expect(res.status).toBe(200);
      expect(res.body?.datos?.fuente).toBe('worldtimeapi');
      expect(res.body?.datos?.fechaHora).toBe('2025-01-01T10:00:00.000Z');
    } finally {
      await cerrar();
    }
  });

  test('si falla el servicio externo devuelve 500', async () => {
    const { app, cerrar } = await prepararAplicacionHora({
      configurar: (router) => {
        router.get('/hora', (req, res) => {
          res.status(500).json({ error: 'fallo' });
        });
      },
    });

    try {
      const res = await request(app).get('/hora');
      expect(res.status).toBe(500);
      expect(res.text).toBe('Server Error');
    } finally {
      await cerrar();
    }
  });
});
