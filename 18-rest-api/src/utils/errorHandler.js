const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errorCode = err.code || "INTERNAL_ERROR";

  const errorResponse = {
    code: statusCode,
    error: errorCode,
    message: message,
  };

  if (err.details) {
    errorResponse.details = err.details;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
