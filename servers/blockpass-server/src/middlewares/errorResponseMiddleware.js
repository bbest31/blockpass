'use strict';
const logger = require('../utils/logger.js');

const sendErrorResponse = (err, _, res, next) => {
  logger.error('error', err);
  res.status(err.status).send({ error: true, message: err.message });
  next();
};

module.exports = sendErrorResponse;
