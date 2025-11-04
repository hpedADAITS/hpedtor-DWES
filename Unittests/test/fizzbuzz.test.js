import { describe, it, expect } from 'vitest';
import { fizzBuzz } from '../src/fizzbuzz.js';

describe('FizzBuzz', () => {
  describe('números regulares', () => {
    it('should return 1 for input 1', () => {
      expect(fizzBuzz(1)).toBe(1);
    });

    it('should return 2 for input 2', () => {
      expect(fizzBuzz(2)).toBe(2);
    });

    it('should return 4 for input 4', () => {
      expect(fizzBuzz(4)).toBe(4);
    });

    it('should return 7 for input 7', () => {
      expect(fizzBuzz(7)).toBe(7);
    });
  });

  describe('múltiplos de 3', () => {
    it('should return fizz for multiples of 3', () => {
      expect(fizzBuzz(3)).toBe('fizz');
      expect(fizzBuzz(6)).toBe('fizz');
      expect(fizzBuzz(9)).toBe('fizz');
      expect(fizzBuzz(12)).toBe('fizz');
    });
  });

  describe('múltiplos de 5', () => {
    it('should return buzz for multiples of 5', () => {
      expect(fizzBuzz(5)).toBe('buzz');
      expect(fizzBuzz(10)).toBe('buzz');
      expect(fizzBuzz(20)).toBe('buzz');
      expect(fizzBuzz(25)).toBe('buzz');
    });
  });

  describe('múltiplos de 15', () => {
    it('should return fizzbuzz for multiples of 15', () => {
      expect(fizzBuzz(15)).toBe('fizzbuzz');
      expect(fizzBuzz(30)).toBe('fizzbuzz');
      expect(fizzBuzz(45)).toBe('fizzbuzz');
      expect(fizzBuzz(60)).toBe('fizzbuzz');
    });
  });

  describe('edge cases', () => {
    it('should throw TypeError for non-number input', () => {
      expect(() => fizzBuzz('3')).toThrow(TypeError);
      expect(() => fizzBuzz(null)).toThrow(TypeError);
      expect(() => fizzBuzz(undefined)).toThrow(TypeError);
      expect(() => fizzBuzz({})).toThrow(TypeError);
    });

    it('should throw RangeError for numbers less than 1', () => {
      expect(() => fizzBuzz(0)).toThrow(RangeError);
      expect(() => fizzBuzz(-1)).toThrow(RangeError);
      expect(() => fizzBuzz(-10)).toThrow(RangeError);
    });
  });
});
