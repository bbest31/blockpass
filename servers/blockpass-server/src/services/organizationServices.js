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

  let response = { ticketTiers: [] };

  for (let i = 0; i < contractAddresses.length; i++) {
    const contract = new web3.eth.Contract(ticketContractAbi, contractAddresses[i]).methods;

    const tokenURI = await contract._tokenURI().call();
    const name = await contract.name().call();
    const supply = await contract.supply().call();
    const symbol = await contract.symbol().call();
    const totalTickets = await contract.getTotalTicketsForSale().call();
    const primarySalePrice = await contract.primarySalePrice().call();
    const liveDate = await contract.liveDate().call();
    const closeDate = await contract.closeDate().call();
    const eventEndDate = await contract.eventEndDate().call();

    const ticketData = {
      tokenURI: tokenURI,
      name: name,
      supply: supply,
      symbol: symbol,
      totalTickets: totalTickets,
      primarySalePrice: primarySalePrice,
      liveDate: convertEpochToDate(liveDate),
      closeDate: convertEpochToDate(closeDate),
      eventEndDate: convertEpochToDate(eventEndDate),
    };

    response.ticketTiers = [...response.ticketTiers, ticketData];
  }

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

function convertEpochToDate(UTCSeconds) {
  const date = new Date(0);
  date.setUTCSeconds(UTCSeconds);
  return date;
}

module.exports = {
  getOrganization,
  patchOrganization,
  getOrganizationEvents,
  patchOrganizationEvents,
  patchOrganizationEventsImages,
  getEventTicketTiers,
};
