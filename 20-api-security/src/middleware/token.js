const JWT = require("../utils/jwt");
const { log } = require("../utils");

const validarToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    const error = new Error("token requerido");
    error.statusCode = 401;
    error.code = "unauthorized";
    return next(error);
  }

  const payload = JWT.verify(token);
  if (!payload) {
    const error = new Error("token inválido");
    error.statusCode = 401;
    error.code = "unauthorized";
    return next(error);
  }

  log.info("token validado");
  req.usuario = payload;
  next();
};

const validarAdmin = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    const error = new Error("token requerido");
    error.statusCode = 401;
    error.code = "unauthorized";
    return next(error);
  }

  const payload = JWT.verify(token);
  if (!payload) {
    const error = new Error("token inválido");
    error.statusCode = 401;
    error.code = "unauthorized";
    return next(error);
  }

  if (payload.rol !== "admin") {
    const error = new Error("acceso admin requerido");
    error.statusCode = 403;
    error.code = "forbidden";
    return next(error);
  }

  log.info("Admin token correcto");
  req.usuario = payload;
  next();
};

module.exports = { validarToken, validarAdmin };
