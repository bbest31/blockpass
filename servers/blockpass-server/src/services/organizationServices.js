'use strict';
const mongoose = require('mongoose');
const fs = require('fs');
const Web3 = require('web3');

const Event = require('../models/Events.js');
const { managementAPI } = require('../apis/auth0Api.js');
const logger = require('../utils/logger');
const { getTicketTierDetails } = require('../utils/web3Utils');

const ORGANIZATION_ATTRIBUTES = ['display_name', 'metadata'];
const EVENT_ATTRIBUTES = ['name', 'location', 'startDate', 'endDate', 'website', 'description', 'removeEndDate'];

// Events

async function getOrganizationEvents(orgId) {
  const events = await Event.find({ orgId: orgId }).exec();
  return events;
}

// Ticket Tiers

async function getEventTicketTiers(eventId) {
  // const ticketContractAbi = JSON.parse(fs.readFileSync('./contracts/artifacts/TicketExample.json')).abi;
  const ticketContractAbi = JSON.parse(fs.readFileSync('./contracts/artifacts/BlockPassTicket.json')).abi;

  const event = await Event.find({ _id: eventId }).exec();
  const contractAddresses = event[0].contracts;

  let response = { ticketTiers: [] };

  for (let i = 0; i < contractAddresses.length; i++) {
    const ticketData = await getTicketTierDetails(contractAddresses[i]).catch((err) => {
      throw err;
    });

    response.ticketTiers = [...response.ticketTiers, ticketData];
  }

  return response;
}

/**
 * Retrieves all information about a ticket tier given it's contract address.
 * @param {string} contractId
 * @returns
 */
async function getTicketTier(contractId) {
  let response;

  const ticketData = await getTicketTierDetails(contractId).catch((err) => {
    throw err;
  });

  // TODO:get and append ticket tier description
  let description = '';

  response = { ...ticketData, description: description };

  return response;
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
  patchOrganizationEventsImages,
  getEventTicketTiers,
  getTicketTier,
};
