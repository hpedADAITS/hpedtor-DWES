require('dotenv').config();

const app = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
};

const config = {
    app,
};

module.exports = config;
