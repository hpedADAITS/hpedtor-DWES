const express = require("express");
const routes = require("../routes");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/v1", routes);

app.use((req, res) => res.status(404).send({ message: "Not Found" }));

module.exports = app;
