'use strict';
const Event = require('../models/Events.js');
const { managementAPI } = require('../apis/auth0Api.js');
const logger = require('../utils/logger');

const ORGANIZATION_ATTRIBUTES = ['display_name', 'metadata'];
const EVENT_ATTRIBUTES = ['name', 'location', 'startDate', 'endDate', 'website', 'description'];

// Events

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

  const event = await Event.findByIdAndUpdate(eventId, payload, { new: true }).exec();

  return event;
}

// Organizations

async function getOrganization(orgId) {
  const org = await managementAPI.organizations.getByID({ id: orgId }).catch((err) => {
    throw err;
  });
  return org;
}

async function patchOrganization(orgId, payload) {
  // search for disallowed payload attributes
  Object.keys(payload).forEach((key) => {
    if (!ORGANIZATION_ATTRIBUTES.includes(key)) {
      throw new Error('organization attribute not allowed to be updated');
    }
  });

  const org = await managementAPI.organizations
    .update({ id: orgId }, payload)
    .then((orgData) => {
      logger.log('info', `Organization info updated for org: ${orgData.name}`);
      return orgData;
    })
    .catch((err) => {
      throw err;
    });

  return org;
}

module.exports = {
  getOrganization,
  patchOrganization,
  getOrganizationEvents,
  patchOrganizationEvents,
};
