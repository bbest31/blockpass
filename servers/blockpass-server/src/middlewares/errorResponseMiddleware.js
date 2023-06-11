'use strict';
const logger = require('../utils/logger.js');
const { httpResponseMessage } = require('../utils/responseMessages.js');

const sendErrorResponse = (err, _, res, next) => {
  if (err) {
    logger.error('error', err);
    let status = err?.status || 500;
    res.status(status).send({ error: true, message: httpResponseMessage[status] });
  }
};

module.exports = sendErrorResponse;
