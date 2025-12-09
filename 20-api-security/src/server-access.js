const express = require("express");
const { log } = require("./utils");
const cfg = require("./config");
const errH = require("./utils/errorHandler");
const access = require("./routes/access");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/v1/access", access);

app.use((req, res) => {
  res.status(404).json({
    code: 404,
    error: "not_found",
    message: "ruta no encontrada"
  });
});

app.use(errH);

app.listen(cfg.port, (error) => {
  if (error) {
    log.err(error);
    return;
  }
  log.info(`servidor token en puerto ${cfg.port}`);
});

module.exports = app;
