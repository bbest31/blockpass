'use strict';
const { claimIncludes } = require('express-oauth2-jwt-bearer');

const checkPermission = (operation, resource) => {
  return claimIncludes('permissions', `${operation}:${resource}`);
};

const checkCreatePermission = (resource) => {
  return checkPermission('create', resource);
};

const checkReadPermission = (resource) => {
  return checkPermission('read', resource);
};

const checkUpdatePermission = (resource) => {
  return checkPermission('update', resource);
};

const checkDeletePermission = (resource) => {
  return checkPermission('delete', resource);
};

module.exports = { checkCreatePermission, checkReadPermission, checkUpdatePermission, checkDeletePermission };
