const express = require('express');
const logger = require('./config/logger');
const morganMiddleware = require('./middlewares/morganMiddleware');
const errorHandler = require('./middlewares/errorHandler');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morganMiddleware);

app.use('/', apiRoutes);
app.use('/', adminRoutes);

app.use((req, res, next) => {
    const error = new Error('Endpoint not found');
    error.statusCode = 404;
    next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
