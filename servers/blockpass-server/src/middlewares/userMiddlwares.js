'use strict';
const { httpResponseMessage } = require('../utils/responseMessages');

const checkUserId = (req, res, next) => {
  const userIdClaim = req.auth.payload.sub;
  const userIdUrlParam = req.params.id;

  if (userIdClaim !== userIdUrlParam) {
    return res.status(401).send(httpResponseMessage[401]);
  } else {
    next();
  }
};

module.exports = { checkUserId };
