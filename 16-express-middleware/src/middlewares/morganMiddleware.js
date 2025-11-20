const morgan = require('morgan');
const logger = require('../config/logger');

morgan.format('api', '[routes] :method :status :url');

const morganMiddleware = morgan('api', {
    skip(req, res) {
        return res.statusCode >= 400;
    },
    stream: logger.stream,
});

module.exports = morganMiddleware;
