const basicMiddleware = require('../middlewares/basic-middleware');
const routes = require('../routes');

module.exports = (expressApp, config) => {
    basicMiddleware(expressApp, config);
    expressApp.use('/api/v1', routes);
    expressApp.use((req, res) =>
        res.status(404).json({ message: 'Not Found' }),
    );
};
