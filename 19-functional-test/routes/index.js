const { Router } = require('express');

const mainRoutes = require('./main-routes');
const usersRoutes = require('./users-routes');
const notesRoutes = require('./notes-routes');

const router = Router();

router.use('/', mainRoutes);
router.use('/users', usersRoutes);
router.use('/notes', notesRoutes);

module.exports = router;
