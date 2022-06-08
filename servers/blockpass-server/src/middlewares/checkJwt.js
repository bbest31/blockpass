'use strict';
const { auth } = require('express-oauth2-jwt-bearer');
const { AUTH0_BLOCKPASS_API } = require('../configs/auth0Config.js');

const checkJwt = auth({
  audience: AUTH0_BLOCKPASS_API.audience,
  issuerBaseURL: AUTH0_BLOCKPASS_API.issuerBaseURL,
});

module.exports = checkJwt;
