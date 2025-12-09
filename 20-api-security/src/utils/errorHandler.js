const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "internal error";
  const code = error.code || "error";
  const response = { code: statusCode, error: code, message };
  if (error.details) response.details = error.details;
  res.status(statusCode).json(response);
};

module.exports = errorHandler;
