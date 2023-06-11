'use strict';
const {
  getEnhancements,
  postEnhancement,
  patchEnhancement,
  deleteEnhancement,
} = require('../services/enhancementServices');

async function readEnhancements(req, res, next) {
  const { ticketTierId } = req.params;

  await getEnhancements(ticketTierId)
    .then((enhancements) => {
      res.status(200).send(enhancements);
    })
    .catch((err) => {
      next(err);
    });
}

async function updateEnhancement(req, res, next) {
  const { enhancementId } = req.params;
  const body = req.body;

  await patchEnhancement(enhancementId, body)
    .then((enhancement) => {
      res.status(200).send(enhancement);
    })
    .catch((err) => {
      next(err);
    });
}

async function createEnhancement(req, res, next) {
  const { ticketTierId } = req.params;
  const body = req.body;

  await postEnhancement(ticketTierId, body)
    .then((enhancement) => {
      res.status(200).send(enhancement);
    })
    .catch((err) => {
      next(err);
    });
}

async function removeEnhancement(req, res, next) {
  const { enhancementId } = req.params;

  await deleteEnhancement(enhancementId)
    .then((enhancement) => {
      res.status(200).send(enhancement);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  readEnhancements,
  createEnhancement,
  updateEnhancement,
  removeEnhancement,
};
