'use strict';
const { getTicketTiers, getTicketTier, getTicketTierOwners } = require('../services/ticketTierServices');

async function readTicketTiers(req, res, next) {
  const { eventId } = req.params;

  await getTicketTiers(eventId)
    .then((ticketTiers) => {
      res.status(200).json(ticketTiers);
    })
    .catch((err) => {
      next(err);
    });
}

async function readTicketTier(req, res, next) {
  const { ticketTierId } = req.params;
  await getTicketTier(ticketTierId)
    .then((ticketTier) => {
      res.status(200).json(ticketTier);
    })
    .catch((err) => {
      next(err);
    });
}

/**
 *
 * @param {*} req
 * @param {*} res
 */
async function readTicketTierOwners(req, res, next) {
  const { ticketTierId } = req.params;
  const { cursor } = req.query;

  await getTicketTierOwners(ticketTierId, cursor)
    .then((owners) => {
      res.status(200).json(owners);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  readTicketTiers,
  readTicketTier,
  readTicketTierOwners,
};
