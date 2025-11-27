const log = (message) => {
  console.log(`[LOG] ${new Date().toISOString()} - ${message}`);
};

const info = (message) => {
  console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
};

const error = (message) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
};

const logger = {
  log,
  info,
  error,
};

module.exports = { log, logger };
