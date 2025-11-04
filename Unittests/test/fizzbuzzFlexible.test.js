import { describe, it, expect } from 'vitest';
import { fizzBuzzFlexible } from '../src/fizzbuzzFlexible.js';

describe('FizzBuzzFlexible', () => {
  describe('default conditions (3: fizz, 5: buzz)', () => {
    it('should work like regular fizzbuzz with default conditions', () => {
      expect(fizzBuzzFlexible(1)).toBe(1);
      expect(fizzBuzzFlexible(3)).toBe('fizz');
      expect(fizzBuzzFlexible(5)).toBe('buzz');
      expect(fizzBuzzFlexible(15)).toBe('fizzbuzz');
    });
  });

  describe('custom conditions', () => {
    it('should handle custom 2-condition setup', () => {
      const conditions = { 2: 'poo', 3: 'fizz', 5: 'buzz', 7: 'bar' };
      expect(fizzBuzzFlexible(2, conditions)).toBe('poo');
      expect(fizzBuzzFlexible(3, conditions)).toBe('fizz');
      expect(fizzBuzzFlexible(5, conditions)).toBe('buzz');
      expect(fizzBuzzFlexible(7, conditions)).toBe('bar');
    });

    it('should combine multiple conditions correctly', () => {
      const conditions = { 2: 'poo', 3: 'fizz', 5: 'buzz', 7: 'bar' };
      expect(fizzBuzzFlexible(6, conditions)).toBe('poofizz');
      expect(fizzBuzzFlexible(10, conditions)).toBe('poobuzz');
      expect(fizzBuzzFlexible(14, conditions)).toBe('poobar');
      expect(fizzBuzzFlexible(15, conditions)).toBe('fizzbuzz');
      expect(fizzBuzzFlexible(21, conditions)).toBe('fizzbar');
      expect(fizzBuzzFlexible(35, conditions)).toBe('buzzbar');
    });

    it('should handle complex combinations', () => {
      const conditions = { 2: 'poo', 3: 'fizz', 5: 'buzz', 7: 'bar' };
      expect(fizzBuzzFlexible(30, conditions)).toBe('poofizzbuzz');
      expect(fizzBuzzFlexible(42, conditions)).toBe('poofizzbar');
      expect(fizzBuzzFlexible(70, conditions)).toBe('poobuzzbar');
      expect(fizzBuzzFlexible(105, conditions)).toBe('fizzbuzzbar');
      expect(fizzBuzzFlexible(210, conditions)).toBe('poofizzbuzzbar');
    });

    it('should return number when no conditions match', () => {
      const conditions = { 2: 'poo', 3: 'fizz' };
      expect(fizzBuzzFlexible(5, conditions)).toBe(5);
      expect(fizzBuzzFlexible(7, conditions)).toBe(7);
      expect(fizzBuzzFlexible(11, conditions)).toBe(11);
    });
  });

  describe('different custom setups', () => {
    it('should work with single condition', () => {
      const conditions = { 4: 'quad' };
      expect(fizzBuzzFlexible(4, conditions)).toBe('quad');
      expect(fizzBuzzFlexible(8, conditions)).toBe('quad');
      expect(fizzBuzzFlexible(3, conditions)).toBe(3);
    });

    it('should work with large divisors', () => {
      const conditions = { 100: 'century' };
      expect(fizzBuzzFlexible(100, conditions)).toBe('century');
      expect(fizzBuzzFlexible(200, conditions)).toBe('century');
      expect(fizzBuzzFlexible(99, conditions)).toBe(99);
    });
  });

  describe('edge cases', () => {
    it('should throw TypeError for non-number input', () => {
      expect(() => fizzBuzzFlexible('3')).toThrow(TypeError);
      expect(() => fizzBuzzFlexible(null)).toThrow(TypeError);
      expect(() => fizzBuzzFlexible(undefined)).toThrow(TypeError);
    });

    it('should throw RangeError for numbers less than 1', () => {
      expect(() => fizzBuzzFlexible(0)).toThrow(RangeError);
      expect(() => fizzBuzzFlexible(-1)).toThrow(RangeError);
    });
  });
});
