const express = require('express');
const loaders = require('./loaders');

const app = express();

loaders.expressLoader(app);

module.exports = app;
