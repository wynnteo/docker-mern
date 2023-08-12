const winston = require("winston");
const expressWinston = require("express-winston");
const { format } = winston;

const infoLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: "logs/info/info.log",
      colorize: true,
      handleExceptions: true, // To handle exceptions
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    }),
  ],
});

const errorLogger = winston.createLogger({
  level: "error",
  format: format.combine(
    format.errors({ stack: true }),
    format.metadata(),
    format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: "logs/error/error.log",
      handleExceptions: true, // To handle exceptions
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5, // keep mostly 5 files
      colorize: false,
    }),
  ],
});

module.exports = {
  infoLogger,
  errorLogger,
};
