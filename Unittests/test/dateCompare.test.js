import { describe, it, expect, vi } from 'vitest';
import { dateCompare } from '../src/dateCompare.js';

describe('dateCompare', () => {
  describe('comparing two dates', () => {
    it('should return earlier date as startDate and later as endDate', () => {
      const result = dateCompare('2023-01-01', '2023-12-31');
      expect(result.startDate).toBe('2023-01-01T00:00:00.000Z');
      expect(result.endDate).toBe('2023-12-31T00:00:00.000Z');
    });

    it('should handle reversed dates correctly', () => {
      const result = dateCompare('2023-12-31', '2023-01-01');
      expect(result.startDate).toBe('2023-01-01T00:00:00.000Z');
      expect(result.endDate).toBe('2023-12-31T00:00:00.000Z');
    });

    it('should handle same dates', () => {
      const result = dateCompare('2023-06-15', '2023-06-15');
      expect(result.startDate).toBe(result.endDate);
    });

    it('should handle ISO string dates', () => {
      const result = dateCompare(
        '2023-01-15T10:30:00.000Z',
        '2023-01-15T15:30:00.000Z'
      );
      expect(result.startDate).toBe('2023-01-15T10:30:00.000Z');
      expect(result.endDate).toBe('2023-01-15T15:30:00.000Z');
    });
  });

  describe('comparing with current date', () => {
    it('should compare with current date when only one date provided', () => {
      const mockNow = new Date('2023-06-15T12:00:00.000Z');
      vi.setSystemTime(mockNow);

      const result = dateCompare('2023-01-01');
      expect(result.startDate).toBe('2023-01-01T00:00:00.000Z');
      expect(result.endDate).toBe('2023-06-15T12:00:00.000Z');

      vi.useRealTimers();
    });

    it('should handle future date with current date', () => {
      const mockNow = new Date('2023-06-15T12:00:00.000Z');
      vi.setSystemTime(mockNow);

      const result = dateCompare('2024-01-01');
      expect(result.startDate).toBe('2023-06-15T12:00:00.000Z');
      expect(result.endDate).toBe('2024-01-01T00:00:00.000Z');

      vi.useRealTimers();
    });
  });

  describe('error handling', () => {
    it('should throw error for invalid date1', () => {
      expect(() => dateCompare('invalid')).toThrow('Invalid date1');
      expect(() => dateCompare('not-a-date')).toThrow('Invalid date1');
    });

    it('should throw error for invalid date2', () => {
      expect(() => dateCompare('2023-01-01', 'invalid')).toThrow(
        'Invalid date2'
      );
    });
  });
});
