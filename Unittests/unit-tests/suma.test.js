import { expect, test } from 'vitest';
import { sumar } from '../suma.js';

test('Prueba sumar', () => {
  expect(sumar(2, 3)).toBe(5);
  expect(sumar(4, 4)).toBe(8);
  expect(sumar(-1, 1)).toBe(0);
  expect(sumar(0, 0)).toBe(0);
  expect(sumar(-2, -3)).toBe(-5);
  expect(sumar(2.5, 3.5)).toBe(6);
});
