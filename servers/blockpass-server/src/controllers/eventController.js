'use strict';
const {
  getOrganizationEvents,
  patchOrganizationEvents,
  postOrganizationEvent,
  patchOrganizationEventsImages,
} = require('../services/eventServices');
// Events

async function readEvents(req, res, next) {
  const { id } = req.params;

  await getOrganizationEvents(id)
    .then((events) => {
      res.status(200).send(events);
    })
    .catch((err) => {
      next(err);
    });
}

/**
 * Creates an event
 * @param {Object} req
 * @param {Object} res
 */
async function createEvent(req, res, next) {
  const { id } = req.params;
  const body = req.body;
  const images = req.newImageUrls;
  body.images = images;

  await postOrganizationEvent(id, body)
    .then((eventItem) => {
      res.status(200).send(eventItem);
    })
    .catch((err) => {
      next(err);
    });
}

async function updateEvents(req, res, next) {
  const { eventId } = req.params;
  const body = req.body;

  await patchOrganizationEvents(eventId, body)
    .then((eventItem) => {
      res.status(200).send(eventItem);
    })
    .catch((err) => {
      next(err);
    });
}

async function updateEventImages(req, res, next) {
  const { eventId } = req.params;
  const newImageUrls = req.newImageUrls;
  const removedImages = req.body.removedImages;

  await patchOrganizationEventsImages(eventId, newImageUrls, removedImages)
    .then((eventItem) => {
      res.status(200).json(eventItem);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  readEvents,
  createEvent,
  updateEvents,
  updateEventImages,
};
