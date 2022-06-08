'use strict';
const AuthenticationClient = require('auth0').AuthenticationClient;
const ManagementClient = require('auth0').ManagementClient;
const { AUTH0_AUTHENTICATION_API, AUTH0_MANAGEMENT_API } = require('../configs/auth0Config.js');

const authenticationAPI = new AuthenticationClient({
  ...AUTH0_AUTHENTICATION_API,
});

const managementAPI = new ManagementClient({
  ...AUTH0_MANAGEMENT_API,
});

module.exports = { authenticationAPI, managementAPI };
