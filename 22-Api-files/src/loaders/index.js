const expressLoader = require("./express");
const fs = require("fs");
const path = require("path");
const config = require("../config");

module.exports = async () => {
  // Ensure files directory exists
  if (!fs.existsSync(config.filesDir)) {
    fs.mkdirSync(config.filesDir, { recursive: true });
  }

  const app = await expressLoader();

  return app;
};
