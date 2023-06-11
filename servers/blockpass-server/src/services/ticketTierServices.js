'use strict';
const mongoose = require('mongoose');
const Moralis = require('moralis').default;

const Event = require('../models/Events.js');
const TicketTier = require('../models/TicketTiers.js');
const { getTicketTierDetails, getEvmChain } = require('../utils/web3Utils');

const TICKET_TIER_ATTRIBUTES = ['displayName', 'description'];

/**
 * Get all ticket tiers given an event id.
 * @param {string} eventId
 * @returns
 */
async function getTicketTiers(eventId) {
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
    throw err;
  }

  const response = await Moralis.EvmApi.nft.getNFTOwners({ address, chain, limit: 50, cursor: cursor });

  return response.toJSON();
}

module.exports = {
  getTicketTiers,
  getTicketTier,
  getTicketTierOwners,
};
