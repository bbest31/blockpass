'use strict';
const { getUserTickets } = require('../services/ticketServices');

/**
 * Read all tickets for a particular user.
 * @param {*} req
 * @param {*} res
 */
const readUserTickets = async (req, res, next) => {
  const { wallet } = req.params;

  await getUserTickets(wallet)
    .then((tickets) => {
      res.status(200).json(tickets);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  readUserTickets,
};
