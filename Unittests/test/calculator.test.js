import { describe, it, expect, beforeEach } from 'vitest';
import { Calculator } from '../src/calculator.js';

describe('Calculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(calculator.add(2, 3)).toBe(5);
      expect(calculator.add(10, 20)).toBe(30);
    });

    it('should add negative numbers', () => {
      expect(calculator.add(-5, -3)).toBe(-8);
      expect(calculator.add(-10, 5)).toBe(-5);
    });

    it('should add zero', () => {
      expect(calculator.add(0, 5)).toBe(5);
      expect(calculator.add(5, 0)).toBe(5);
    });

    it('should throw TypeError for non-number inputs', () => {
      expect(() => calculator.add('2', 3)).toThrow(TypeError);
      expect(() => calculator.add(2, '3')).toThrow(TypeError);
      expect(() => calculator.add(null, 3)).toThrow(TypeError);
    });
  });

  describe('subtract', () => {
    it('should subtract two positive numbers', () => {
      expect(calculator.subtract(5, 3)).toBe(2);
      expect(calculator.subtract(10, 7)).toBe(3);
    });

    it('should handle negative results', () => {
      expect(calculator.subtract(3, 5)).toBe(-2);
      expect(calculator.subtract(0, 10)).toBe(-10);
    });

    it('should subtract zero', () => {
      expect(calculator.subtract(5, 0)).toBe(5);
    });

    it('should throw TypeError for non-number inputs', () => {
      expect(() => calculator.subtract('5', 3)).toThrow(TypeError);
      expect(() => calculator.subtract(5, undefined)).toThrow(TypeError);
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers', () => {
      expect(calculator.multiply(2, 3)).toBe(6);
      expect(calculator.multiply(5, 4)).toBe(20);
    });

    it('should handle multiplication with zero', () => {
      expect(calculator.multiply(5, 0)).toBe(0);
      expect(calculator.multiply(0, 5)).toBe(0);
    });

    it('should multiply negative numbers', () => {
      expect(calculator.multiply(-2, 3)).toBe(-6);
      expect(calculator.multiply(-2, -3)).toBe(6);
    });

    it('should throw TypeError for non-number inputs', () => {
      expect(() => calculator.multiply('2', 3)).toThrow(TypeError);
      expect(() => calculator.multiply({}, 3)).toThrow(TypeError);
    });
  });

  describe('divide', () => {
    it('should divide two positive numbers', () => {
      expect(calculator.divide(6, 2)).toBe(3);
      expect(calculator.divide(10, 5)).toBe(2);
    });

    it('should handle division with decimals', () => {
      expect(calculator.divide(5, 2)).toBe(2.5);
      expect(calculator.divide(1, 3)).toBeCloseTo(0.333, 2);
    });

    it('should divide negative numbers', () => {
      expect(calculator.divide(-6, 2)).toBe(-3);
      expect(calculator.divide(-6, -2)).toBe(3);
    });

    it('should throw error for division by zero', () => {
      expect(() => calculator.divide(5, 0)).toThrow(
        'Division by zero is not allowed'
      );
    });

    it('should throw TypeError for non-number inputs', () => {
      expect(() => calculator.divide('6', 2)).toThrow(TypeError);
      expect(() => calculator.divide(6, null)).toThrow(TypeError);
    });
  });
});
