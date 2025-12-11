const config = require("./config");
const loaders = require("./loaders");

const startServer = async () => {
  try {
    const app = await loaders();

    const server = app.listen(config.PORT, () => {
      console.log(`Servidor en la URL: http://localhost:${config.PORT}`);
    });

    const timeout = 15 * 60 * 1000;
    server.timeout = timeout;
    server.headersTimeout = timeout;
    server.keepAliveTimeout = timeout;
  } catch (err) {
    console.error("error iniciando:", err);
    process.exit(1);
  }
};

startServer();
