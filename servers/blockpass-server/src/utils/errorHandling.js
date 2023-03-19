const logger = require('./logger');

function mongoQueryCallback(err, result) {
  if (err) {
    logger.log('error', err);
  }

  return result;
}

module.exports = { mongoQueryCallback };
