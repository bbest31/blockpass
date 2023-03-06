'use strict';
const mongoose = require('mongoose');
const fs = require('fs');
const Web3 = require('web3');

const Event = require('../models/Events.js');
const { managementAPI } = require('../apis/auth0Api.js');
const logger = require('../utils/logger');
const { remove } = require('../models/Events.js');

const ORGANIZATION_ATTRIBUTES = ['display_name', 'metadata'];
const EVENT_ATTRIBUTES = ['name', 'location', 'startDate', 'endDate', 'website', 'description', 'removeEndDate'];
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.PROVIDER));

// Events

async function getOrganizationEvents(orgId) {
  const events = await Event.find({ orgId: orgId }).exec();
  return events;
}

async function getEventTicketTiers(eventId) {
  const ticketContractAbi = JSON.parse(fs.readFileSync('./contracts/artifacts/TicketExample.json')).abi;

  const event = await Event.find({ _id: eventId }).exec();

  const contractAddresses = event[0].contracts;

  let response = {};
  
  // collect all necessary data and create a response for each ticket tier
  contractAddresses.forEach((contractAddress) => {
    const contract = new web3.eth.Contract(ticketContractAbi, contractAddress);
    console.log(contract.methods);

    contract.methods.getTotalTicketsForSale.call((err, res) => {
      if (err) {
        console.log('err', err);
      } else {
        console.log('res ', res);
      }
    });
  });

  return event;
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
};
