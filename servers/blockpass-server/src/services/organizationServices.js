'use strict';
const mongoose = require('mongoose');
const Moralis = require('moralis').default;

const Event = require('../models/Events.js');
const TicketTier = require('../models/TicketTiers.js');
const { managementAPI } = require('../apis/auth0Api.js');
const logger = require('../utils/logger');
const { getTicketTierDetails, getEvmChain } = require('../utils/web3Utils');

const ORGANIZATION_ATTRIBUTES = ['display_name', 'metadata'];
const EVENT_ATTRIBUTES = ['name', 'location', 'startDate', 'endDate', 'website', 'description', 'removeEndDate'];
const TICKET_TIER_ATTRIBUTES = ['displayName', 'description'];

// Events

async function getOrganizationEvents(orgId) {
  const events = await Event.find({ orgId: orgId }).exec();
  return events;
}

// Ticket Tiers

/**
 * Get all ticket tiers given an event id.
 * @param {string} eventId
 * @returns
 */
async function getEventTicketTiers(eventId) {
  const event = await Event.findById(eventId)
    .exec()
    .catch((err) => {
      throw err;
    });
  if (event === null) {
    return [];
  }
  const ticketTiers = event.ticketTiers;

  let response = { ticketTiers: [] };

  for (let i = 0; i < ticketTiers.length; i++) {
    const tier = await getTicketTier(ticketTiers[i]).catch((err) => {
      logger.log('error', err);
      if (!(err instanceof mongoose.Error.CastError)) {
        throw err;
      }
    });

    response.ticketTiers = [...response.ticketTiers, tier];
  }

  return response;
}

/**
 * Retrieves all information about a ticket tier given it's id.
 * @param {string} ticketTierId
 * @returns
 */
async function getTicketTier(ticketTierId) {
  // get ticket tier db data
  const ticketTier = await TicketTier.findById(ticketTierId)
    .exec()
    .catch((err) => {
      logger.log('error', err);
      if (!(err instanceof mongoose.Error.CastError)) {
        throw err;
      }
    });
  if (!ticketTier) {
    return {};
  }

  let tierData = ticketTier._doc;
  // get ticket tier smart contract data
  const contractData = await getTicketTierDetails(ticketTier.contract).catch((err) => {
    throw err;
  });

  let response = { ...contractData, ...tierData };

  return response;
}

/**
 * Reads all owners of an NFT by contract address.
 * @param {*} ticketTierId
 * @param {*} cursor
 * @returns
 */
async function getTicketTierOwners(ticketTierId, cursor) {
  // get ticket tier db data
  const ticketTier = await TicketTier.findById(ticketTierId)
    .exec()
    .catch((err) => {
      logger.log('error', err);
      if (!(err instanceof mongoose.Error.CastError)) {
        throw err;
      }
    });
  if (!ticketTier) {
    return {};
  }

  const address = ticketTier.contract;
  const chain = getEvmChain();

  if (!chain) {
    let err = new Error('Can not determine EVM Chain.');
    logger.log('error', err);
    throw err;
  }

  const response = await Moralis.EvmApi.nft.getNFTOwners({ address, chain, limit: 50, cursor: cursor });

  return response.toJSON();
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
  getTicketTierOwners,
};
