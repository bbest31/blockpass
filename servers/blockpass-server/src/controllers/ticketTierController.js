'use strict';
const {
  getEventTicketTiers,
  getTicketTier,
  getTicketTierOwners,
} = require('../services/organizationServices.js');
const { httpResponseMessage } = require('../utils/responseMessages.js');
const logger = require('../utils/logger');

async function readOrganizationEventTicketTiers(req, res) {
  const { eventId } = req.params;

  await getEventTicketTiers(eventId)
    .then((ticketTiers) => {
      res.status(200).json(ticketTiers);
    })
    .catch((err) => {
      logger.error('error', err);
      res.status(500).send(httpResponseMessage[500]);
    });
}

async function readTicketTier(req, res) {
  const { ticketTierId } = req.params;
  await getTicketTier(ticketTierId)
    .then((ticketTier) => {
      res.status(200).json(ticketTier);
    })
    .catch((err) => {
      logger.error('error', err);
      res.status(500).send(httpResponseMessage[500]);
    });
}

/**
 *
 * @param {*} req
 * @param {*} res
 */
async function readTicketTierOwners(req, res) {
  const { ticketTierId } = req.params;
  const { cursor } = req.query;

  await getTicketTierOwners(ticketTierId, cursor)
    .then((owners) => {
      res.status(200).json(owners);
    })
    .catch((err) => {
      logger.error('error', err);
      res.status(500).send(httpResponseMessage[500]);
    });
}

module.exports = {
  readOrganizationEventTicketTiers,
  readTicketTier,
  readTicketTierOwners,
};