'use strict';
const { auth } = require('express-oauth2-jwt-bearer');
const AUTH0_API = require('../configs/auth0Api.js');

const checkJwt = auth({
  audience: AUTH0_API.audience,
  issuerBaseURL: AUTH0_API.issuerBaseURL,
});

module.exports = checkJwt;
