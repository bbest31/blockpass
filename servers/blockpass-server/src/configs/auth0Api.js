'use strict';
const AUTH0_API = {
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

module.exports = AUTH0_API;
