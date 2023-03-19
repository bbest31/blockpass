'use strict';
const {
  getOrganizationEvents,
  patchOrganizationEvents,
  getOrganization,
  patchOrganization,
  patchOrganizationEventsImages,
  getEventTicketTiers,
  getTicketTier,
} = require('../services/organizationServices.js');
const { httpResponseMessage } = require('../utils/responseMessages.js');
const logger = require('../utils/logger');

// Organizations

async function readOrganization(req, res) {
  const { id } = req.params;

  await getOrganization(id)
    .then((org) => {
      res.status(200).send(org);
    })
    .catch((err) => {
      logger.error('error', err);
      res.status(500).send(httpResponseMessage[500]);
    });
}

async function updateOrganization(req, res) {
  const { id } = req.params;
  const body = req.body;

  await patchOrganization(id, body)
    .then((org) => {
      res.status(200).send(org);
    })
    .catch((err) => {
      logger.error('error', err);
      res.status(500).send(httpResponseMessage[500]);
    });
}

// Events

async function readEvents(req, res) {
  const { id } = req.params;

  await getOrganizationEvents(id)
    .then((events) => {
      res.status(200).send(events);
    })
    .catch((err) => {
      logger.error('error', err);
      res.status(500).send(httpResponseMessage[500]);
    });
}

async function updateEvents(req, res) {
  const { eventId } = req.params;
  const body = req.body;

  await patchOrganizationEvents(eventId, body)
    .then((eventItem) => {
      res.status(200).send(eventItem);
    })
    .catch((err) => {
      logger.error('error', err);
      res.status(500).send(httpResponseMessage[500]);
    });
}

async function updateEventImages(req, res) {
  const { eventId } = req.params;
  const newImageUrls = req.newImageUrls;
  const removedImages = req.body.removedImages;

  await patchOrganizationEventsImages(eventId, newImageUrls, removedImages)
    .then((eventItem) => {
      res.status(200).json(eventItem);
    })
    .catch((err) => {
      logger.error('error', err);
      res.status(500).send(httpResponseMessage[500]);
    });
}

// Ticket Tiers

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

module.exports = {
  readEvents,
  updateOrganization,
  readOrganization,
  updateEvents,
  updateEventImages,
  readOrganizationEventTicketTiers,
  readTicketTier,
};
