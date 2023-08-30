const jwt = require('jsonwebtoken');

/**
 * Validates the JWT provided in requests cookie signed by the attendee wallet.
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {function} next
 * @returns
 */
const checkAttendeeJWT = (req, res, next) => {
  const token = req.cookies.jwt;
  const wallet = req.params.wallet;
  if (!token) return res.sendStatus(403); // if the user did not send a jwt token, they are unauthorized

  try {
    const verifiedToken = jwt.verify(token, process.env.AUTH_SECRET);
    // ensure that user address within token matches the wallet address in the request
    if (wallet !== verifiedToken.address) return res.sendStatus(403);
    next();
  } catch {
    return res.sendStatus(403);
  }
};

module.exports = { checkAttendeeJWT };
