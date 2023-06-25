'use strict';
const mongoose = require('mongoose');
const Moralis = require('moralis').default;

const Event = require('../models/Events.js');
const TicketTier = require('../models/TicketTiers.js');
const { getTicketTierDetails, getEvmChain, getMarketplaceContract } = require('../utils/web3Utils');

const TICKET_TIER_ATTRIBUTES = ['displayName', 'description'];

/**
 * Posts a new ticket tier to the database and adds the id to the corresponding event.
 * @param {*} eventId
 * @param {*} ticketTier
 * @returns
 */
const postTicketTier = async (eventId, newticketTier) => {
  // post ticket tier
  const session = await TicketTier.startSession();
  session.startTransaction();
  let result = {};
  try {
    const opts = { session };
    const ticketTier = await TicketTier.create([newticketTier], opts);
    result = ticketTier[0];

    // push new ticket tier id into the events ticket tiers array.
    await Event.findByIdAndUpdate(
      eventId,
      { $push: { ticketTiers: result._id.toString() } },
      { new: true, upsert: true }
    )
      .exec()
      .catch((err) => {
        throw err;
      });

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }

  return result;
};

/**
 * Get all ticket tiers given an event id.
 * @param {string} eventId
 * @returns
 */
const getTicketTiers = async (eventId) => {
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
};

/**
 * Retrieves all information about a ticket tier given it's id.
 * @param {string} ticketTierId
 * @returns
 */
const getTicketTier = async (ticketTierId) => {
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
};

/**
 * Reads all owners of an NFT by contract address.
 * @param {*} ticketTierId
 * @param {*} cursor
 * @returns
 */
const getTicketTierOwners = async (ticketTierId, cursor) => {
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
};

const getTicketTierStats = async (ticketTierId, cursor) => {
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

  // initialize output values to increment.
  let stats = {
    ticketsSold: 0,
    secondarySales: 0,
    revenue: 0,
    volume: 0,
    primaryRevenue: 0,
    secondaryRevenue: 0,
    primaryVolume: 0,
    secondaryVolume: 0,
  };

  // get the marketplace contract address
  const contractData = await getMarketplaceContract(address).catch((err) => {
    throw err;
  });

  // get TicketSold ABI from marketplace ABI JSON.

  // TODO get contract events and parse for ticket tier events.
  const response = Moralis.EvmApi.events.getContractEvents({
    address: contractData.marketplaceContract,
    chain,
    topic: '',
    fromDate: contractData.liveDate,
  });
};

module.exports = {
  getTicketTiers,
  getTicketTier,
  getTicketTierOwners,
  getTicketTierStats,
  postTicketTier,
};
