'use strict';
const { httpResponseMessage } = require('../utils/responseMessages');

const checkOrganizationId = (req, res, next) => {
  const orgIdClaim = req.auth.payload.org_id;
  const orgIdUrlParam = req.params.id;

  if (orgIdClaim !== orgIdUrlParam) {
    return res.status(401).send(httpResponseMessage[401]);
  } else {
    next();
  }
};

module.exports = { checkOrganizationId };
