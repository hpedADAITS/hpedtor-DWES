const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

router.get('/success', (req, res, next) => {
    try {
        logger.info('Successful request to /success');
        res.status(200).send({
            code: 200,
            message: 'Success',
        });
    } catch (err) {
        return next(err);
    }
});

router.get('/not-found', (req, res, next) => {
    try {
        const error = new Error('Resource not found');
        error.statusCode = 404;
        throw error;
    } catch (err) {
        return next(err);
    }
});

router.get('/error', (req, res, next) => {
    try {
        const error = new Error('Internal server error');
        error.statusCode = 500;
        throw error;
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
