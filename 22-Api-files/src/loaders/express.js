const express = require("express");
const config = require("../config");
const routes = require("../routes");
const multer = require("multer");

module.exports = () => {
  const app = express();

  app.use((req, res, next) => {
    req.setTimeout(config.requestTimeout);
    next();
  });

  app.use(express.static("public"));
  app.use(express.json());

  app.use(routes);

  app.use((err, req, res, next) => {
    console.error("Error:", err);

    if (err instanceof multer.MulterError) {
      if (err.code === "FILE_TOO_LARGE") {
        return res.status(400).json({ error: "archivo muy grande" });
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({ error: "demasiados archivos" });
      }
    }

    res.status(500).json({ error: "error interno" });
  });

  app.use((req, res) => {
    res.status(404).json({ error: "no encontrado" });
  });

  return app;
};
