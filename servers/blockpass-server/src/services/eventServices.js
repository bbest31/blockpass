'use strict';
const mongoose = require('mongoose');

const Event = require('../models/Events.js');

const EVENT_ATTRIBUTES = ['name', 'location', 'startDate', 'endDate', 'website', 'description', 'removeEndDate'];

/**
 * Gets events
 * @param {number} skip
 * @param {number} limit
 * @returns {Array<Object>}
 */
const getEvents = async (skip, limit) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const events = await Event.find({ endDate: { $gte: today } })
    .lean()
    .sort({ endDate: 1 })
    .skip(skip)
    .limit(limit)
    .populate({ path: 'ticketTiers', populate: { path: 'enhancements' } })
    .exec();

  return events;
};

/**
 * Gets the events given an organization id.
 * @param {string} orgId
 * @returns
 */
const getOrganizationEvents = async (orgId) => {
  const events = await Event.find({ orgId: orgId })
    .populate({ path: 'ticketTiers', populate: { path: 'enhancements' } })
    .exec();
  return events;
};

/**
 * Creates an Event and persists it to the database.
 * @param {string} orgId
 * @param {Object} payload
 * @returns {Object}
 */
const postOrganizationEvent = async (orgId, payload) => {
  // save to event to database
  const event = await Event.create({ orgId, ...payload });
  await event.save().catch((err) => {
    throw err;
  });

  return event;
};

/**
 * Updates an organizations event.
 * @param {string} eventId
 * @param {Object} payload
 * @returns {Object}
 */
const patchOrganizationEvents = async (eventId, payload) => {
  Object.keys(payload).forEach((key) => {
    if (!EVENT_ATTRIBUTES.includes(key)) {
      throw new Error('event attribute not allowed to be updated');
    }
  });

  // Remove endDate as a field from the document then payload
  if (payload?.removeEndDate) {
    await Event.findByIdAndUpdate(eventId, { $unset: { endDate: 1 } });
    delete payload.removeEndDate;
  }

  const event = await Event.findByIdAndUpdate(eventId, { ...mongoose.sanitizeFilter(payload) }, { new: true }).populate(
    'ticketTiers'
  );
  return event;
};

/**
 * Updates the images for an event.
 * @param {string} eventId
 * @param {Array<string>} imageUrls
 * @param {Array<string>} removedImages
 * @returns {Object}
 */
const patchOrganizationEventsImages = async (eventId, imageUrls, removedImages) => {
  let event = await Event.findById(eventId);

  if (imageUrls) {
    event.images = [...event.images, ...imageUrls];
  }

  if (removedImages) {
    removedImages.forEach((removedImage) => {
      event.images = event.images.filter((image) => image !== removedImage);
    });
  }

  await event.save().catch((err) => {
    throw err;
  });

  event = await Event.findById(eventId).populate('ticketTiers');

  return event;
};

module.exports = {
  getEvents,
  getOrganizationEvents,
  postOrganizationEvent,
  patchOrganizationEvents,
  patchOrganizationEventsImages,
};
