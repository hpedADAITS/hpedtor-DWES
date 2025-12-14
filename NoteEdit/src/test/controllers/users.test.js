import { jest } from '@jest/globals';
import { listarUsuarios } from '../../controllers/users.js';

describe('controller usuarios', () => {
  test('responde con lista de usuarios', () => {
    const res = { json: jest.fn() };
    listarUsuarios({}, res);
    expect(res.json).toHaveBeenCalled();
    const payload = res.json.mock.calls[0][0];
    expect(Array.isArray(payload.datos)).toBe(true);
  });
});
