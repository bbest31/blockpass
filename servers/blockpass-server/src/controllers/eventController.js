'use strict';
const {
  getEvents,
  getEventById,
  getEventOrganizer,
  getOrganizationEvents,
  patchOrganizationEvents,
  postOrganizationEvent,
  patchOrganizationEventsImages,
} = require('../services/eventServices');
// Events

/**
 * Get events.
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {function} next
 */
const readEvents = async (req, res, next) => {
  const { skip, limit, ticketTierId } = req.query;
  await getEvents(skip || 0, limit || 20, ticketTierId)
    .then((events) => {
      res.status(200).send(events);
    })
    .catch((err) => next(err));
};

/**
 * Get event by id.
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {function} next
 */
const readEventById = async (req, res, next) => {
  const { id } = req.params;

  await getEventById(id)
    .then((event) => {
      res.status(200).send(event);
    })
    .catch((err) => next(err));
};

/**
 * Get event organizer.
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {function} next
 */
const readEventOrganizer = async (req, res, next) => {
  const { id } = req.params;

  await getEventOrganizer(id)
    .then((organzier) => {
      res.status(200).send(organzier);
    })
    .catch((err) => next(err));
};

/**
 * Reads the events for an organization.
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {function} next
 */
const readOrganizationEvents = async (req, res, next) => {
  const { id } = req.params;

  await getOrganizationEvents(id)
    .then((events) => {
      res.status(200).send(events);
    })
    .catch((err) => {
      next(err);
    });
};

/**
 * Creates an event
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {function} next
 */
const createEvent = async (req, res, next) => {
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
};

/**
 * Update an event.
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {function} next
 */
const updateEvents = async (req, res, next) => {
  const { eventId } = req.params;
  const body = req.body;

  await patchOrganizationEvents(eventId, body)
    .then((eventItem) => {
      res.status(200).send(eventItem);
    })
    .catch((err) => {
      next(err);
    });
};

/**
 * Updates the images of an event.
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {function} next
 */
const updateEventImages = async (req, res, next) => {
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
};

module.exports = {
  readEvents,
  readEventById,
  readEventOrganizer,
  readOrganizationEvents,
  createEvent,
  updateEvents,
  updateEventImages,
};
