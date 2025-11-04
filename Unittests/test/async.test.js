import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  delay,
  fetchDataAsync,
  processMultipleItems,
  fetchWithTimeout,
} from '../src/async.js';

describe('Async Functions', () => {
  describe('delay', () => {
    it('should delay for specified milliseconds', async () => {
      const start = Date.now();
      await delay(100);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(90);
    });

    it('should resolve promise', async () => {
      await expect(delay(10)).resolves.toBeUndefined();
    });
  });

  describe('fetchDataAsync', () => {
    it('should fetch data for valid id', async () => {
      const result = await fetchDataAsync(1);
      expect(result).toEqual({ id: 1, data: 'Data for 1' });
    });

    it('should fetch data for different ids', async () => {
      const result1 = await fetchDataAsync(5);
      const result2 = await fetchDataAsync(10);

      expect(result1).toEqual({ id: 5, data: 'Data for 5' });
      expect(result2).toEqual({ id: 10, data: 'Data for 10' });
    });

    it('should throw error for negative id', async () => {
      await expect(fetchDataAsync(-1)).rejects.toThrow('Invalid ID');
      await expect(fetchDataAsync(-10)).rejects.toThrow('Invalid ID');
    });

    it('should handle id 0', async () => {
      const result = await fetchDataAsync(0);
      expect(result).toEqual({ id: 0, data: 'Data for 0' });
    });
  });

  describe('processMultipleItems', () => {
    it('should process array of items', async () => {
      const result = await processMultipleItems([1, 2, 3]);
      expect(result).toEqual([2, 4, 6]);
    });

    it('should handle empty array', async () => {
      const result = await processMultipleItems([]);
      expect(result).toEqual([]);
    });

    it('should process negative numbers', async () => {
      const result = await processMultipleItems([-1, -2, -3]);
      expect(result).toEqual([-2, -4, -6]);
    });

    it('should process single item', async () => {
      const result = await processMultipleItems([5]);
      expect(result).toEqual([10]);
    });
  });

  describe('fetchWithTimeout', () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it('should fetch data successfully within timeout', async () => {
      const mockData = { data: 'test' };
      global.fetch.mockResolvedValue({
        json: async () => mockData,
      });

      const result = await fetchWithTimeout('https://api.example.com/data');
      expect(result).toEqual(mockData);
    });

    it('should throw timeout error when request takes too long', async () => {
      global.fetch.mockImplementation(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject({ name: 'AbortError' }), 100);
          })
      );

      await expect(
        fetchWithTimeout('https://api.example.com/slow', 50)
      ).rejects.toThrow('Request timeout');
    });

    it('should propagate other fetch errors', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      await expect(
        fetchWithTimeout('https://api.example.com/error')
      ).rejects.toThrow('Network error');
    });

    it('should use default timeout of 5000ms', async () => {
      const mockData = { data: 'test' };
      global.fetch.mockResolvedValue({
        json: async () => mockData,
      });

      const result = await fetchWithTimeout('https://api.example.com/data');
      expect(result).toEqual(mockData);
    });
  });
});
