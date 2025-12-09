const express = require("express");
const swaggerUi = require("swagger-ui-express");
const routes = require("../routes");
const errorHandler = require("../utils/errorHandler");
const spec = require("../swagger");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(spec, { explorer: true }));

app.use("/api/v1", routes);

app.use((req, res) => {
  res.status(404).json({
    code: 404,
    error: "not_found",
    message: "ruta no encontrada",
  });
});

app.use(errorHandler);

module.exports = app;
