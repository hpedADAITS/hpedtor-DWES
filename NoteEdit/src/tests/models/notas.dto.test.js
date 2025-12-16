import {
  esquemaCrearNota, esquemaActualizarNota, esquemaListarNotasQuery, esquemaImportarNotas,
} from '../../modules/notas/models/dto.js';

describe('DTO notas', () => {
  describe('esquemaCrearNota', () => {
    test('valida nota valida', () => {
      const resultado = esquemaCrearNota.safeParse({
        titulo: 'Test',
        contenido: 'Contenido',
        categoria: 'trabajo',
      });
      expect(resultado.success).toBe(true);
    });

    test('rechaza sin titulo', () => {
      const resultado = esquemaCrearNota.safeParse({
        contenido: 'Contenido',
      });
      expect(resultado.success).toBe(false);
    });

    test('rechaza titulo vacio', () => {
      const resultado = esquemaCrearNota.safeParse({
        titulo: '',
        contenido: 'Contenido',
      });
      expect(resultado.success).toBe(false);
    });

    test('categoria es opcional', () => {
      const resultado = esquemaCrearNota.safeParse({
        titulo: 'Test',
        contenido: 'Contenido',
      });
      expect(resultado.success).toBe(true);
      expect(resultado.data.categoria).toBe('general');
    });

    test('contenido es opcional', () => {
      const resultado = esquemaCrearNota.safeParse({
        titulo: 'Test',
      });
      expect(resultado.success).toBe(true);
      expect(resultado.data.contenido).toBe('');
    });
  });

  describe('esquemaActualizarNota', () => {
    test('permite actualizar titulo', () => {
      const resultado = esquemaActualizarNota.safeParse({
        titulo: 'Nuevo titulo',
      });
      expect(resultado.success).toBe(true);
    });

    test('permite actualizar contenido', () => {
      const resultado = esquemaActualizarNota.safeParse({
        contenido: 'Nuevo contenido',
      });
      expect(resultado.success).toBe(true);
    });

    test('permite actualizar categoria', () => {
      const resultado = esquemaActualizarNota.safeParse({
        categoria: 'personal',
      });
      expect(resultado.success).toBe(true);
    });

    test('requiere al menos un campo', () => {
      const resultado = esquemaActualizarNota.safeParse({});
      expect(resultado.success).toBe(false);
    });

    test('rechaza titulo vacio', () => {
      const resultado = esquemaActualizarNota.safeParse({
        titulo: '',
      });
      expect(resultado.success).toBe(false);
    });
  });

  describe('esquemaListarNotasQuery', () => {
    test('acepta valores por defecto', () => {
      const resultado = esquemaListarNotasQuery.safeParse({});
      expect(resultado.success).toBe(true);
      expect(resultado.data.page).toBe(1);
      expect(resultado.data.limit).toBe(10);
      expect(resultado.data.sort).toBe('actualizadaEn');
      expect(resultado.data.order).toBe('desc');
    });

    test('acepta page y limit validos', () => {
      const resultado = esquemaListarNotasQuery.safeParse({
        page: 2,
        limit: 20,
      });
      expect(resultado.success).toBe(true);
      expect(resultado.data.page).toBe(2);
      expect(resultado.data.limit).toBe(20);
    });

    test('rechaza page menor que 1', () => {
      const resultado = esquemaListarNotasQuery.safeParse({
        page: 0,
      });
      expect(resultado.success).toBe(false);
    });

    test('rechaza limit mayor que 100', () => {
      const resultado = esquemaListarNotasQuery.safeParse({
        limit: 101,
      });
      expect(resultado.success).toBe(false);
    });

    test('acepta sort validos', () => {
      const sorts = ['creadaEn', 'actualizadaEn', 'titulo', 'tamano'];
      sorts.forEach((sort) => {
        const resultado = esquemaListarNotasQuery.safeParse({ sort });
        expect(resultado.success).toBe(true);
        expect(resultado.data.sort).toBe(sort);
      });
    });

    test('rechaza sort invalido', () => {
      const resultado = esquemaListarNotasQuery.safeParse({
        sort: 'invalido',
      });
      expect(resultado.success).toBe(false);
    });

    test('acepta order validos', () => {
      ['asc', 'desc'].forEach((order) => {
        const resultado = esquemaListarNotasQuery.safeParse({ order });
        expect(resultado.success).toBe(true);
        expect(resultado.data.order).toBe(order);
      });
    });

    test('rechaza order invalido', () => {
      const resultado = esquemaListarNotasQuery.safeParse({
        order: 'invalido',
      });
      expect(resultado.success).toBe(false);
    });

    test('acepta filtros de texto', () => {
      const resultado = esquemaListarNotasQuery.safeParse({
        tituloContiene: 'test',
        contenidoContiene: 'contenido',
        categoria: 'trabajo',
      });
      expect(resultado.success).toBe(true);
      expect(resultado.data.tituloContiene).toBe('test');
      expect(resultado.data.contenidoContiene).toBe('contenido');
      expect(resultado.data.categoria).toBe('trabajo');
    });

    test('acepta fechas validas', () => {
      const resultado = esquemaListarNotasQuery.safeParse({
        creadaDesde: '2024-01-01',
        creadaHasta: '2024-12-31',
        actualizadaDesde: '2024-01-01T00:00:00',
        actualizadaHasta: '2024-12-31T23:59:59',
      });
      expect(resultado.success).toBe(true);
      expect(resultado.data.creadaDesde).toBe('2024-01-01');
      expect(resultado.data.creadaHasta).toBe('2024-12-31');
    });

    test('rechaza creadaDesde invalida', () => {
      const resultado = esquemaListarNotasQuery.safeParse({
        creadaDesde: 'fecha-invalida',
      });
      expect(resultado.success).toBe(false);
      expect(resultado.error.issues[0].message).toBe('creadaDesde invalida');
    });

    test('rechaza creadaHasta invalida', () => {
      const resultado = esquemaListarNotasQuery.safeParse({
        creadaHasta: 'no-es-fecha',
      });
      expect(resultado.success).toBe(false);
      expect(resultado.error.issues[0].message).toBe('creadaHasta invalida');
    });

    test('rechaza actualizadaDesde invalida', () => {
      const resultado = esquemaListarNotasQuery.safeParse({
        actualizadaDesde: 'invalid-date',
      });
      expect(resultado.success).toBe(false);
      expect(resultado.error.issues[0].message).toBe('actualizadaDesde invalida');
    });

    test('rechaza actualizadaHasta invalida', () => {
      const resultado = esquemaListarNotasQuery.safeParse({
        actualizadaHasta: 'invalid-date',
      });
      expect(resultado.success).toBe(false);
      expect(resultado.error.issues[0].message).toBe('actualizadaHasta invalida');
    });

    test('permite fechas vacias o undefined', () => {
      const resultado = esquemaListarNotasQuery.safeParse({
        creadaDesde: undefined,
        creadaHasta: '',
      });
      expect(resultado.success).toBe(true);
    });
  });

  describe('esquemaImportarNotas', () => {
    test('valida importacion correcta', () => {
      const resultado = esquemaImportarNotas.safeParse({
        archivos: [
          {
            nombre: 'nota1.txt',
            contenido: 'contenido',
            categoria: 'trabajo',
          },
        ],
      });
      expect(resultado.success).toBe(true);
    });

    test('requiere archivos', () => {
      const resultado = esquemaImportarNotas.safeParse({
        archivos: [],
      });
      expect(resultado.success).toBe(false);
    });

    test('nombre es requerido en archivos', () => {
      const resultado = esquemaImportarNotas.safeParse({
        archivos: [
          {
            contenido: 'contenido',
          },
        ],
      });
      expect(resultado.success).toBe(false);
    });

    test('contenido es opcional', () => {
      const resultado = esquemaImportarNotas.safeParse({
        archivos: [
          {
            nombre: 'nota1.txt',
          },
        ],
      });
      expect(resultado.success).toBe(true);
      expect(resultado.data.archivos[0].contenido).toBe('');
    });

    test('categoria es opcional', () => {
      const resultado = esquemaImportarNotas.safeParse({
        archivos: [
          {
            nombre: 'nota1.txt',
          },
        ],
      });
      expect(resultado.success).toBe(true);
      expect(resultado.data.archivos[0].categoria).toBe('general');
    });
  });
});
