'use strict';
const Event = require('../models/Events.js');

async function getOrganizationEvents(orgId) {
  const events = await Event.find({ orgId: orgId }).exec();
  return events;
}

module.exports = {
  getOrganizationEvents,
};
