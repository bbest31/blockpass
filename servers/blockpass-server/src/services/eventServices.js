'use strict';
const mongoose = require('mongoose');

const Event = require('../models/Events.js');

const EVENT_ATTRIBUTES = ['name', 'location', 'startDate', 'endDate', 'website', 'description', 'removeEndDate'];


async function getOrganizationEvents(orgId) {
  const events = await Event.find({ orgId: orgId }).exec();
  return events;
}

async function patchOrganizationEvents(eventId, payload) {
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

  const event = await Event.findByIdAndUpdate(eventId, { ...mongoose.sanitizeFilter(payload) }, { new: true });
  return event;
}

async function patchOrganizationEventsImages(eventId, imageUrls, removedImages) {
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

  event = await Event.findById(eventId);

  return event;
}

module.exports = {
  getOrganizationEvents,
  patchOrganizationEvents,
  patchOrganizationEventsImages,
};