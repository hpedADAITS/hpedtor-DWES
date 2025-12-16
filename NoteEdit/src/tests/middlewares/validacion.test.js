import { z } from 'zod';
import { validarBody, validarParams, validarQuery } from '../../core/middlewares/validacion.js';

describe('middleware validacion', () => {
  describe('validarBody', () => {
    test('pasa datos validos', (done) => {
      const schema = z.object({
        nombre: z.string(),
        edad: z.number(),
      });

      const req = {
        body: { nombre: 'Juan', edad: 25 },
      };

      const res = {};
      const next = () => {
        expect(req.body.nombre).toBe('Juan');
        expect(req.body.edad).toBe(25);
        done();
      };

      validarBody(schema)(req, res, next);
    });

    test('rechaza datos invalidos', (done) => {
      const schema = z.object({
        nombre: z.string(),
      });

      const req = {
        body: { nombre: 123 },
      };

      const res = {
        status: (code) => ({
          json: (data) => {
            expect(code).toBe(400);
            expect(data.mensaje).toBe('datos invalidos');
            expect(data.errores.length).toBeGreaterThan(0);
            done();
          },
        }),
      };

      validarBody(schema)(req, res, () => {});
    });

    test('maneja body vacio', (done) => {
      const schema = z.object({
        nombre: z.string().optional(),
      });

      const req = {
        body: undefined,
      };

      const res = {};
      const next = () => {
        expect(req.body).toBeDefined();
        done();
      };

      validarBody(schema)(req, res, next);
    });
  });

  describe('validarParams', () => {
    test('pasa params validos', (done) => {
      const schema = z.object({
        id: z.string(),
      });

      const req = {
        params: { id: '123' },
      };

      const res = {};
      const next = () => {
        expect(req.params.id).toBe('123');
        done();
      };

      validarParams(schema)(req, res, next);
    });

    test('rechaza params invalidos', (done) => {
      const schema = z.object({
        id: z.string().min(5),
      });

      const req = {
        params: { id: '1' },
      };

      const res = {
        status: (code) => ({
          json: (data) => {
            expect(code).toBe(400);
            expect(data.errores).toBeDefined();
            done();
          },
        }),
      };

      validarParams(schema)(req, res, () => {});
    });
  });

  describe('validarQuery', () => {
    test('pasa query valido', (done) => {
      const schema = z.object({
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(10),
      });

      const req = {
        query: { page: '2', limit: '20' },
      };

      const res = {};
      const next = () => {
        expect(req.queryValidada.page).toBe(2);
        expect(req.queryValidada.limit).toBe(20);
        done();
      };

      validarQuery(schema)(req, res, next);
    });

    test('aplica valores por defecto', (done) => {
      const schema = z.object({
        page: z.coerce.number().default(1),
      });

      const req = {
        query: {},
      };

      const res = {};
      const next = () => {
        expect(req.queryValidada.page).toBe(1);
        done();
      };

      validarQuery(schema)(req, res, next);
    });

    test('rechaza query invalido', (done) => {
      const schema = z.object({
        page: z.coerce.number().positive(),
      });

      const req = {
        query: { page: '0' },
      };

      const res = {
        status: (code) => ({
          json: (_data) => {
            expect(code).toBe(400);
            done();
          },
        }),
      };

      validarQuery(schema)(req, res, () => {});
    });
  });
});
