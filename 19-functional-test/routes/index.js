const { Router } = require('express');

const mainRoutes = require('./main-routes');
const usersRoutes = require('./users-routes');

const router = Router();

router.use('/', mainRoutes);
router.use('/users', usersRoutes);

module.exports = router;
