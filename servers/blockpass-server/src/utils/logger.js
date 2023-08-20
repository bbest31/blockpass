'use strict';
const { createLogger, transports, format } = require('winston');
const { printf, combine, timestamp, uncolorize, errors, ms, json } = format;
const { File } = transports;
const { LOG_LEVEL, NODE_ENV } = require('../configs/loggerConfig.js');

const buildLogger = () => {
  const devLogFormat = printf(({ timestamp, level, message, stack, ms }) => {
    return `${timestamp} ${level}: ${stack || message} ${ms}`;
  });

  const logger = createLogger({
    level: LOG_LEVEL,
    format: combine(
      uncolorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      ms(),
      NODE_ENV === 'development' ? devLogFormat : json()
    ),
    transports: [new File({ filename: './logs/error.log', level: 'error' })],
  });

  return logger;
};

module.exports = buildLogger();
