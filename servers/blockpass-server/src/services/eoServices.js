'use strict';
const Event = require('../models/Events.js');

async function getEoEvents(orgId) {
  const events = await Event.find({ orgId: orgId }).exec();
  return events;
}

module.exports = {
  getEoEvents,
};
