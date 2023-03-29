'use strict';
const {
  getOrganizationEvents,
  patchOrganizationEvents,
  patchOrganizationEventsImages,
} = require('../services/organizationServices.js');

const { httpResponseMessage } = require('../utils/responseMessages.js');
const logger = require('../utils/logger');
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

module.exports = {
  readEvents,
  updateEvents,
  updateEventImages,
};