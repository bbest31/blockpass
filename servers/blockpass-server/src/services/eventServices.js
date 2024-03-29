'use strict';
const mongoose = require('mongoose');
const Event = require('../models/Events.js');
const { getOrganization } = require('./organizationServices.js');
const EVENT_ATTRIBUTES = ['name', 'location', 'startDate', 'endDate', 'website', 'description', 'removeEndDate'];

/**
 * Gets events
 * @param {number} skip
 * @param {number} limit
 * @param {string} ticketTierId
 * @returns {Array<Object>}
 */
const getEvents = async (skip, limit, ticketTierId) => {
  let events;
  if (ticketTierId) {
    events = await Event.find({ ticketTiers: ticketTierId })
      .lean()
      .sort({ endDate: 1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: 'ticketTiers', populate: { path: 'enhancements' } })
      .exec();
  } else {
    const startOfTodayUTC = new Date(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate(), 0, 0, 0)
    );
    events = await Event.find({ startDate: { $gte: startOfTodayUTC } })
      .lean()
      .sort({ endDate: 1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: 'ticketTiers', populate: { path: 'enhancements' } })
      .exec();
  }

  return events;
};

/**
 * Gets an event by it's id.
 * @param {string} id
 * @returns {Object}
 */
const getEventById = async (id) => {
  const event = await Event.findById(id)
    .lean()
    .populate({ path: 'ticketTiers', populate: { path: 'enhancements' } })
    .exec();

  return event;
};

/**
 * Gets an events event organizer.
 * @param {string} id
 * @returns {Object}
 */
const getEventOrganizer = async (id) => {
  const event = await Event.findById(id)
    .lean()
    .exec();
  const org = await getOrganization(event.orgId);
  delete org.metadata;
  delete org.name;
  return org;
};

/**
 * Gets the events given an organization id.
 * @param {string} orgId
 * @returns
 */
const getOrganizationEvents = async (orgId) => {
  const events = await Event.find({ orgId: orgId })
    .lean()
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
  getEventById,
  getEventOrganizer,
  getOrganizationEvents,
  postOrganizationEvent,
  patchOrganizationEvents,
  patchOrganizationEventsImages,
};
