const express = require('express');
const router = express.Router();
const apiService = require('../services/apiService');

/**
 * GET /api/users
 * Bridge to JSONPlaceholder users endpoint
 * Query params: limit, page
 */
router.get('/users', async (req, res) => {
  try {
    const options = {
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      page: req.query.page ? parseInt(req.query.page) : undefined
    };
    
    const data = await apiService.getUsers(options);
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/posts
 * Bridge to JSONPlaceholder posts endpoint
 * Query params: userId, limit, page, sort, order
 */
router.get('/posts', async (req, res) => {
  try {
    const options = {
      userId: req.query.userId ? parseInt(req.query.userId) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      page: req.query.page ? parseInt(req.query.page) : undefined,
      sort: req.query.sort,
      order: req.query.order
    };
    
    const data = await apiService.getPosts(options);
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/comments
 * Bridge to JSONPlaceholder comments endpoint
 * Query params: postId, limit, page
 */
router.get('/comments', async (req, res) => {
  try {
    const options = {
      postId: req.query.postId ? parseInt(req.query.postId) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      page: req.query.page ? parseInt(req.query.page) : undefined
    };
    
    const data = await apiService.getComments(options);
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
