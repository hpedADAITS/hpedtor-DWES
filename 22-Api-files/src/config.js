const path = require("path");

module.exports = {
  PORT: process.env.PORT || 3000,
  filesDir: path.join(__dirname, "../files"),
  multer: {
    fileSize: 50 * 1024 * 1024,
    maxFiles: 10,
  },
  requestTimeout: 10 * 60 * 1000,
};
