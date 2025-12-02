const express = require('express');
const cors = require('cors');

module.exports = (expressApp, config) => {
    expressApp.use(cors());
    expressApp.use(express.json({ limit: '50mb' }));
    expressApp.use(express.urlencoded({ limit: '50mb', extended: true }));
};
