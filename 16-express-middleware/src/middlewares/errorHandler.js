const logger = require('../config/logger');

function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;

    if (statusCode < 500) {
        logger.warn(`[${statusCode}] ${err.message}`);
    } else {
        logger.error(`[${statusCode}] ${err.message}`);
    }

    if (statusCode < 500) {
        res.status(statusCode).send({
            code: statusCode,
            message: err.message,
        });
    } else {
        res.status(statusCode).send({
            code: statusCode,
            message: 'Server Error',
        });
    }
}

module.exports = errorHandler;
