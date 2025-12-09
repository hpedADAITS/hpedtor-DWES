const JWT = require("../utils/jwt");
const { log } = require("../utils");

const authenticate = (req, res, next) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (!token) {
    const err = new Error("Falta token");
    err.statusCode = 401;
    err.code = "unauthorized";
    return next(err);
  }

  const payload = JWT.verify(token);
  if (!payload) {
    const err = new Error("token expirado o invalido");
    err.statusCode = 401;
    err.code = "unauthorized";
    return next(err);
  }

  req.user = payload;
  log.info(`Funciona! ${payload.id}`);
  next();
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      const err = new Error("Sin autorizacion");
      err.statusCode = 401;
      err.code = "unauthorized";
      return next(err);
    }
    if (!allowedRoles.includes(req.user.role)) {
      const err = new Error("Prohibido");
      err.statusCode = 403;
      err.code = "forbidden";
      return next(err);
    }
    next();
  };
};

module.exports = { authenticate, authorize };
