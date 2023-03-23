'use strict';
const { httpResponseMessage } = require('../utils/responseMessages');

const checkOrganizationId = (req, res, next) => {
  const orgIdClaim = req.auth.payload.org_id;
  const orgIdUrlParam = req.params.id;

  if (orgIdClaim !== orgIdUrlParam) {
    next({ status: 401, message: httpResponseMessage[401] });
  } else {
    next();
  }
};

module.exports = { checkOrganizationId };
