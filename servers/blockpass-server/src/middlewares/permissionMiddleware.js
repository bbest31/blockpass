'use strict';
const { claimIncludes } = require('express-oauth2-jwt-bearer');

const checkPermission = (operation, resource) => {
  return claimIncludes('permissions', `${operation}:${resource}`);
};

module.exports = checkPermission;
