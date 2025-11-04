import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchUser, fetchPosts, createUser } from '../src/api.js';

describe('API Tests', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  describe('fetchUser', () => {
    it('should fetch user data', async () => {
      const mockUser = { id: 1, name: 'John Doe' };
      global.fetch.mockResolvedValue({
        json: async () => mockUser,
      });

      const result = await fetchUser(1);

      expect(result).toEqual(mockUser);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users/1'
      );
    });

    it('should fetch different user by id', async () => {
      const mockUser = { id: 5, name: 'Jane Smith' };
      global.fetch.mockResolvedValue({
        json: async () => mockUser,
      });

      const result = await fetchUser(5);

      expect(result).toEqual(mockUser);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users/5'
      );
    });

    it('should handle fetch errors', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      await expect(fetchUser(1)).rejects.toThrow('Network error');
    });
  });

  describe('fetchPosts', () => {
    it('should fetch all posts', async () => {
      const mockPosts = [
        { id: 1, title: 'Post 1' },
        { id: 2, title: 'Post 2' },
      ];
      global.fetch.mockResolvedValue({
        json: async () => mockPosts,
      });

      const result = await fetchPosts();

      expect(result).toEqual(mockPosts);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/posts'
      );
    });

    it('should return empty array when no posts', async () => {
      global.fetch.mockResolvedValue({
        json: async () => [],
      });

      const result = await fetchPosts();

      expect(result).toEqual([]);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = { name: 'New User', email: 'user@example.com' };
      const mockResponse = { id: 10, ...userData };

      global.fetch.mockResolvedValue({
        json: async () => mockResponse,
      });

      const result = await createUser(userData);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        }
      );
    });

    it('should handle creation errors', async () => {
      const userData = { name: 'Test' };
      global.fetch.mockRejectedValue(new Error('Creation failed'));

      await expect(createUser(userData)).rejects.toThrow('Creation failed');
    });
  });
});
