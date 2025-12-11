const express = require('express');
const routes = require('../routes');

function expressLoader(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api', routes);

  return app;
}

module.exports = expressLoader;
