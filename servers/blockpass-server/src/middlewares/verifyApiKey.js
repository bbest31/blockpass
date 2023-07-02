const API_KEY = process.env.API_KEY;

/**
 * Validates the API key provided in requests from the client app.
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {function} next
 * @returns
 */
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['blockpass-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: true, message: 'API key is missing' });
  }

  if (apiKey !== API_KEY) {
    return res.status(403).json({ error: true, message: 'Invlaid API key' });
  }

  // Valid API key
  next();
};
