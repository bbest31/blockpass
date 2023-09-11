'use strict';
const mongoose = require('mongoose');
const Moralis = require('moralis').default;

const Event = require('../models/Events.js');
const TicketTier = require('../models/TicketTiers.js');
const {
  getTicketTierDetails,
  getEvmChain,
  getAbi,
  contractCallCallback,
  getRoyaltyInfo,
} = require('../utils/web3Utils');
const DateTime = require('../utils/datetime');
const web3 = require('../apis/web3Api.js');

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
    .lean()
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

    if (Object.keys(tier).length) {
      response.ticketTiers = [...response.ticketTiers, tier];
    }
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
    .lean()
    .populate('enhancements')
    .exec()
    .catch((err) => {
      if (!(err instanceof mongoose.Error.CastError)) {
        throw err;
      }
    });
  if (!ticketTier) {
    return {};
  }

  // get ticket tier smart contract data
  const contractData = await getTicketTierDetails(ticketTier.contract).catch((err) => {
    throw err;
  });

  let response = { ...contractData, ...ticketTier };

  return response;
};

/**
 * Retrieves all information about a ticket tier given it's id.
 * @param {string} contract
 * @returns
 */
const getTicketTierByContract = async (address) => {
  // get ticket tier db data
  const filter = `0x${address.slice(2).toUpperCase()}`;
  const ticketTier = await TicketTier.findOne({ contract: { $regex: filter, $options: 'i' } })
    .lean()
    .populate('enhancements')
    .exec()
    .catch((err) => {
      if (!(err instanceof mongoose.Error.CastError)) {
        throw err;
      }
    });
  if (!ticketTier) {
    return {};
  }

  // get ticket tier smart contract data
  const contractData = await getTicketTierDetails(ticketTier.contract).catch((err) => {
    throw err;
  });

  let response = { ...contractData, ...ticketTier };

  return response;
};

/**
 * Reads all owners of an NFT by contract address.
 * @param {*} ticketTierId
 * @param {*} cursor
 * @returns {Object}
 */
const getTicketTierOwners = async (ticketTierId, cursor) => {
  // get ticket tier db data
  const ticketTier = await TicketTier.findById(ticketTierId)
    .lean()
    .populate('enhancements')
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

/**
 * Retrieves the sales statistics for a ticket tier.
 * @param {string} ticketTierId
 * @returns {Object}
 */
const getTicketTierStats = async (ticketTierId) => {
  // get ticket tier db data
  const ticketTier = await TicketTier.findById(ticketTierId)
    .lean()
    .populate('enhancements')
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

  // get the ticket contract data
  const contractData = await getTicketTierDetails(address).catch((err) => {
    throw err;
  });

  // get ABI from marketplace ABI JSON.
  const marketplaceAbi = getAbi('BlockPass');

  // Get contract events and parse for ticket tier events.
  const marketplaceContract = new web3.eth.Contract(marketplaceAbi, contractData.marketplaceContract);

  // get event organizer take rate
  const marketplaceMethods = marketplaceContract.methods;
  const marketplaceTakeRate = (await marketplaceMethods.TAKE_RATE().call(contractCallCallback)) / 10000;
  const eventOrganizerTakeRate = 1 - marketplaceTakeRate;

  const events = await marketplaceContract.getPastEvents('TicketSold', {
    filter: { ticketContract: address },
    fromBlock: 0,
    toBlock: 'latest',
  });

  const processedEvents = await processEvents(events, stats, address, eventOrganizerTakeRate);

  return { address, ...stats, processedEvents };
};

/**
 * For each ticket sold event in events update the sales stats for a ticket tier.
 * @param {Array} events - An array of ticket sold contract events
 * @param {Object} stats - the metrics being calculated for the ticket tier
 * @param {string} contract - the smart contract address of the ticket tier
 * @param {number} takeRate - the take rate of the marketplace contract.
 * @returns {Array}
 */
const processEvents = async (events, stats, contract, takeRate) => {
  const processedEvents = await Promise.all(
    events.map(async (event) => {
      return await processEventStats(event, stats, contract, takeRate);
    })
  );

  stats.revenue = stats.secondaryRevenue + stats.primaryRevenue;
  stats.volume = stats.secondaryVolume + stats.primaryVolume;

  return processedEvents;
};

/**
 * Updates the ticket tier stats based on the ticket sold event, and returns the event with the block timestamp added.
 * @param {Object} event - the object representing the tiket sold contract event
 * @param {Object} stats - the metrics being calculated for the ticket tier
 * @param {string} contract - the smart contract address of the ticket tier
 * @param {number} takeRate - the take rate of the maerketplace contract
 * @returns {Object}
 */
const processEventStats = async (event, stats, contract, takeRate) => {
  // get block timestamp for event
  const block = await web3.eth.getBlock(event?.blockNumber || event?.blockHash);
  event.blockTimestamp = DateTime.convertEpochToDate(block.timestamp);
  const values = event.returnValues;
  const price = parseInt(values.price);

  if (values.isPrimary === true) {
    stats.ticketsSold++;
    stats.primaryRevenue += price * takeRate;
    stats.primaryVolume += price;
  } else {
    const royalty = await getRoyaltyInfo(contract, values.tokenId, price);
    stats.secondarySales++;
    stats.secondaryRevenue += royalty;
    stats.secondaryVolume += price;
  }
  return event;
};

module.exports = {
  getTicketTiers,
  getTicketTier,
  getTicketTierByContract,
  getTicketTierOwners,
  getTicketTierStats,
  postTicketTier,
};
