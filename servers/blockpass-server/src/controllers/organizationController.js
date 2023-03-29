'use strict';
const {
  getOrganization,
  patchOrganization,
} = require('../services/organizationServices.js');
const { httpResponseMessage } = require('../utils/responseMessages.js');
const logger = require('../utils/logger');


async function readOrganization(req, res) {
  const { id } = req.params;

  await getOrganization(id)
    .then((org) => {
      res.status(200).send(org);
    })
    .catch((err) => {
      logger.error('error', err);
      res.status(500).send(httpResponseMessage[500]);
    });
}

async function updateOrganization(req, res) {
  const { id } = req.params;
  const body = req.body;

  await patchOrganization(id, body)
    .then((org) => {
      res.status(200).send(org);
    })
    .catch((err) => {
      logger.error('error', err);
      res.status(500).send(httpResponseMessage[500]);
    });
}


module.exports = {
  updateOrganization,
  readOrganization,
};
