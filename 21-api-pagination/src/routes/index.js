const express = require('express');
const booksRoutes = require('./users');

const router = express.Router();

router.use('/books', booksRoutes);

module.exports = router;
