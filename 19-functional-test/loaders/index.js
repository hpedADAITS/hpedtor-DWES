const expressLoader = require('./express');

function init(app, config) {
    expressLoader(app, config.app);
}

module.exports = {
    init,
};
