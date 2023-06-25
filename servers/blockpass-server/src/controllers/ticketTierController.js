'use strict';
const {
  getTicketTiers,
  getTicketTier,
  getTicketTierOwners,
  postTicketTier,
} = require('../services/ticketTierServices');
const { httpResponseMessage } = require('../utils/responseMessages.js');
const logger = require('../utils/logger');

/**
 * Read all ticket tiers from a specific event.
 * @param {*} req
 * @param {*} res
 */
const readTicketTiers = async (req, res, next) => {
  const { eventId } = req.params;

  await getTicketTiers(eventId)
    .then((ticketTiers) => {
      res.status(200).json(ticketTiers);
    })
    .catch((err) => {
      next(err);
    });
};

/**
 * Read a specific ticket tier by id.
 * @param {*} req
 * @param {*} res
 */
const readTicketTier = async (req, res, next) => {
  const { ticketTierId } = req.params;
  await getTicketTier(ticketTierId)
    .then((ticketTier) => {
      res.status(200).json(ticketTier);
    })
    .catch((err) => {
      next(err);
    });
};

/**
 * Read the owners of a specific ticket tier
 * @param {*} req
 * @param {*} res
 */
const readTicketTierOwners = async (req, res, next) => {
  const { ticketTierId } = req.params;
  const { cursor } = req.query;

  await getTicketTierOwners(ticketTierId, cursor)
    .then((owners) => {
      res.status(200).json(owners);
    })
    .catch((err) => {
      next(err);
    });
};

const createTicketTier = async (req, res, next) => {
  const { eventId } = req.params;
  const body = req.body;

  await postTicketTier(eventId, body)
    .then((tier) => {
      res.status(200).send(tier);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  readTicketTiers,
  readTicketTier,
  readTicketTierOwners,
  createTicketTier,
};
