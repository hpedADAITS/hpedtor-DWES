const { log } = require("./utils");
const app = require("./app");
const cfg = require("./config");

app.listen(cfg.port, (error) => {
  if (error) {
    log.err(error);
    return;
  }
  log.info(`Servidor escuchando en PUERTO ${cfg.port}`);
});
