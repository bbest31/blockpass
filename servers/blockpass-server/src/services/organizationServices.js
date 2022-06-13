'use strict';
const Event = require('../models/Events.js');
const { managementAPI } = require('../apis/auth0Api.js');

const ORGANIZATION_ATTRIBUTES = ['display_name'];

async function getOrganizationEvents(orgId) {
  const events = await Event.find({ orgId: orgId }).exec();
  return events;
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
      console.log(`Organization info updated for org: ${orgData.name}`);
    })
    .catch((err) => {
      throw err;
    });

  return org;
}

module.exports = {
  patchOrganization,
  getOrganizationEvents,
};
