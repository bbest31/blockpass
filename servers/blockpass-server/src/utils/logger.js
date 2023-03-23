'use strict';
const { createLogger, transports, format } = require('winston');
const { printf, combine, timestamp, colorize, uncolorize, errors, ms, json } = format;
const { Console, File } = transports;
const { LOG_LEVEL, NODE_ENV } = require('../configs/loggerConfig.js');

const buildLogger = () => {
  const devLogFormat = printf(({ timestamp, level, message, stack, ms }) => {
    return `${timestamp} ${level}: ${stack || message} ${ms}`;
  });

  const logger = createLogger({
    level: LOG_LEVEL,
    format: combine(
      NODE_ENV === 'development' ? colorize() : uncolorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      ms(),
      NODE_ENV === 'development' ? devLogFormat : json()
    ),
    transports: [
      NODE_ENV === 'development' ? new Console() : new File({ filename: "./logs/error.log", level: "error" }),
    ],
  });

  return logger;
};

module.exports = buildLogger();
