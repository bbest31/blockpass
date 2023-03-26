'use strict';
const mongoose = require('mongoose');

const Enhancement = require('../models/Enhancements');
const TicketTier = require('../models/TicketTiers');
const logger = require('../utils/logger');

async function getEnhancements(ticketTierId) {
  const tier = await TicketTier.findById(ticketTierId)
    .exec()
    .catch((err) => {
      throw err;
    });

  if (tier === null) {
    return [];
  }
  const enhancementIds = tier.enhancements;

  let response = { enhancements: [] };

  for (let i = 0; i < enhancementIds.length; i++) {
    const enhancement = await getEnhancementById(enhancementIds[i]).catch((err) => {
      logger.log('error', err);
      if (!(err instanceof mongoose.Error.CastError)) {
        throw err;
      }
    });

    response.enhancements = [...response.enhancements, enhancement];
  }

  return response;
}

async function getEnhancementById(id) {
  const enhancement = await Enhancement.findById(id)
    .exec()
    .catch((err) => {
      if (!(err instanceof mongoose.Error.CastError)) {
        throw err;
      }
    });
  if (!enhancement) {
    return {};
  }

  let data = enhancement._doc;
  return data;
}

async function postEnhancement(newEnhancement) {

  const session = await Enhancement.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    const enhancement = await Enhancement.create([newEnhancement], opts);
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    session.endSession();
  }

  return {};
}

async function patchEnhancement(id, newEnhancement) {}

async function deleteEnhancement(enhancementId) {}

module.exports = {
  getEnhancements,
  postEnhancement,
  patchEnhancement,
  deleteEnhancement,
};
