const JWT = require("../utils/jwt");
const { logger } = require("../utils");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    const error = new Error("Authorization token missing");
    error.statusCode = 401;
    error.code = "UNAUTHORIZED";
    return next(error);
  }

  const payload = JWT.verifyToken(token);

  if (!payload) {
    const error = new Error("Invalid or expired token");
    error.statusCode = 401;
    error.code = "UNAUTHORIZED";
    return next(error);
  }

  req.user = payload;
  logger.info(`Authenticated user: ${payload.userId} (${payload.role})`);
  next();
};

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error("User not authenticated");
      error.statusCode = 401;
      error.code = "UNAUTHORIZED";
      return next(error);
    }

    if (!allowedRoles.includes(req.user.role)) {
      const error = new Error(
        `Insufficient permissions. Required roles: ${allowedRoles.join(", ")}`,
      );
      error.statusCode = 403;
      error.code = "FORBIDDEN";
      return next(error);
    }

    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
