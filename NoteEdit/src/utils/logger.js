import winston from 'winston';

const {
  combine,
  timestamp,
  printf,
  colorize,
} = winston.format;

const formatoPlano = printf(({ level, message, timestamp: marca }) => `[${marca}] ${level}: ${message}`);

const logger = winston.createLogger({
  level: 'info',
  format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatoPlano),
  transports: [new winston.transports.Console()],
});

export default logger;
