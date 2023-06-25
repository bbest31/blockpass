'use strict';
const AUTH0_BLOCKPASS_API = {
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

const AUTH0_AUTHENTICATION_API = {
  domain: process.env.AUTH0_BASE_URL,
  clientId: process.env.AUTH0_CLIENT_ID,
};

const AUTH0_MANAGEMENT_API = {
  domain: process.env.AUTH0_BASE_URL,
  clientId: process.env.AUTH0_SERVER_ID,
  clientSecret: process.env.AUTH0_SERVER_SECRET,
};

module.exports = { AUTH0_BLOCKPASS_API, AUTH0_AUTHENTICATION_API, AUTH0_MANAGEMENT_API };
