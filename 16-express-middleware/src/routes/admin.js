const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin', adminAuth, (req, res, next) => {
    try {
        res.status(200).send({
            message: 'Bienvenid@, disfrute del contenido',
        });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
