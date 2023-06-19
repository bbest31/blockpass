'use strict';
const mongoose = require('mongoose');

const Enhancement = require('../models/Enhancements');
const TicketTier = require('../models/TicketTiers');

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
      if (!(err instanceof mongoose.Error.CastError)) {
        throw err;
      }
    });

    response.enhancements = [...response.enhancements, enhancement];
  }

  return response;
}

/**
 *
 * @param {*} id
 * @returns
 */
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

/**
 *
 * @param {*} tierId
 * @param {*} newEnhancement
 * @returns
 */
async function postEnhancement(tierId, newEnhancement) {
  const session = await Enhancement.startSession();
  session.startTransaction();
  let result = {};
  try {
    const opts = { session };
    const enhancement = await Enhancement.create([newEnhancement], opts);
    result = enhancement[0];

    // push new enhancement id into the ticket tier enhancements array.
    await TicketTier.findByIdAndUpdate(
      tierId,
      { $push: { enhancements: result._id.toString() } },
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
}

/**
 * Updates the enhancement with the given id
 * @param {string} id
 * @param {Object} newEnhancement
 * @returns
 */
async function patchEnhancement(id, newEnhancement) {
  const enhancement = await Enhancement.findByIdAndUpdate(id, newEnhancement, {
    returnDocument: 'after',
    runValidators: true,
  })
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

/**
 * Deletes an Enhancement given an id
 * @param {string} enhancementId
 * @returns
 */
async function deleteEnhancement(enhancementId) {
  const enhancement = await Enhancement.findOneAndRemove({ _id: enhancementId })
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

module.exports = {
  getEnhancements,
  postEnhancement,
  patchEnhancement,
  deleteEnhancement,
};
