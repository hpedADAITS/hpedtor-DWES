import { jest } from '@jest/globals';
import { iniciarServidorExpress } from '../helpers/httpServer.js';

const envOriginal = { ...process.env };

const prepararServicioHora = async ({
  configurar,
  baseExtra = '/api/timezone/',
  zona = '/Europe/Madrid',
}) => {
  const servidor = await iniciarServidorExpress(configurar);
  process.env.HORA_API_BASE = `${servidor.urlBase}${baseExtra}`;
  process.env.HORA_API_ZONA = zona;
  jest.resetModules();
  const { obtenerHoraExterna } = await import('../../modules/hora/service.js');
  return { obtenerHoraExterna, cerrar: servidor.cerrar };
};

describe('servicio hora', () => {
  afterEach(() => {
    process.env = { ...envOriginal };
  });

  test('normaliza url base y zona', async () => {
    const rutas = [];
    const { obtenerHoraExterna, cerrar } = await prepararServicioHora({
      configurar: (router) => {
        router.get('/api/timezone/Europe/Madrid', (req, res) => {
          rutas.push(req.url);
          res.json({ datetime: '2025-01-01T10:00:00.000Z' });
        });
      },
      baseExtra: '/api/timezone/',
      zona: '/Europe/Madrid',
    });

    try {
      const datos = await obtenerHoraExterna();
      expect(datos.fechaHora).toBe('2025-01-01T10:00:00.000Z');
      expect(rutas[0]).toBe('/api/timezone/Europe/Madrid');
    } finally {
      await cerrar();
    }
  });

  test('si falta datetime falla', async () => {
    const { obtenerHoraExterna, cerrar } = await prepararServicioHora({
      configurar: (router) => {
        router.get('/api/timezone/Europe/Madrid', (req, res) => {
          res.json({ ok: true });
        });
      },
      baseExtra: '/api/timezone',
      zona: 'Europe/Madrid',
    });

    try {
      await expect(obtenerHoraExterna()).rejects.toThrow('hora api respuesta invalida');
    } finally {
      await cerrar();
    }
  });
});
