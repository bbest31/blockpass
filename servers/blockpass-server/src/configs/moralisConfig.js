const MORALIS_CONFIG = {
  domain: process.env.APP_DOMAIN,
  statement: 'Please sign this message to confirm your identity.',
  uri: process.env.CLIENT_URL,
  timeout: 60,
};

module.exports = MORALIS_CONFIG;
