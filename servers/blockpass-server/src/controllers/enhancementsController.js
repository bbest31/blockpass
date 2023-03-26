'use strict';
const {
  getEnhancements,
  postEnhancement,
  patchEnhancement,
  deleteEnhancement,
} = require('../services/enhancementServices');
const { httpResponseMessage } = require('../utils/responseMessages.js');
const logger = require('../utils/logger');

async function readEnhancements(req, res) {
  const { ticketTierId } = req.params;

  await getEnhancements(ticketTierId)
    .then((enhancements) => {
      res.status(200).send(enhancements);
    })
    .catch((err) => {
      logger.error('error', err);
      res.status(500).send(httpResponseMessage[500]);
    });
}

async function updateEnhancement(req, res) {
  const { enhancementId } = req.params;
  const body = req.body;

  await patchEnhancement(enhancementId, body)
    .then((enhancement) => {
      res.status(200).send(enhancement);
    })
    .catch((err) => {
      logger.error('error', err);
      res.status(500).send(httpResponseMessage[500]);
    });
}

async function createEnhancement(req, res) {
  //TODO update ticket tier enhancement list
  const { ticketTierId } = req.params;
  const body = req.body;

  await postEnhancement(body)
    .then((enhancement) => {
      res.status(200).send(enhancement);
    })
    .catch((err) => {
      logger.error('error', err);
      res.status(500).send(httpResponseMessage[500]);
    });
}

async function removeEnhancement(req, res) {
  const { enhancementId } = req.params;
  //TODO update ticket tier enhancement list?

  await deleteEnhancement(enhancementId)
    .then((enhancement) => {
      res.status(200).send(enhancement);
    })
    .catch((err) => {
      logger.error('error', err);
      res.status(500).send(httpResponseMessage[500]);
    });
}

module.exports = {
  readEnhancements,
  createEnhancement,
  updateEnhancement,
  removeEnhancement,
};
