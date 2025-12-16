import { accesoVip, accesoAdmin } from '../../modules/seguridad/controller.js';

describe('controller seguridad', () => {
  test('vip usa rol por defecto si no existe', () => {
    const res = { json: (p) => p };
    const payload = accesoVip({}, res);
    expect(payload.rol).toBe('desconocido');
  });

  test('vip incluye rol si existe', () => {
    const res = { json: (p) => p };
    const payload = accesoVip({ rol: 'usuario' }, res);
    expect(payload.rol).toBe('usuario');
  });

  test('admin usa rol por defecto si no existe', () => {
    const res = { json: (p) => p };
    const payload = accesoAdmin({ headers: {} }, res);
    expect(payload.rol).toBe('admin');
  });

  test('admin incluye rol si existe', () => {
    const res = { json: (p) => p };
    const payload = accesoAdmin({ rol: 'admin', headers: { 'x-usuario': 'admin' } }, res);
    expect(payload.rol).toBe('admin');
  });
});
