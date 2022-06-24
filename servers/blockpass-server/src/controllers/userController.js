'use strict';
const { patchUser, sendPasswordReset } = require('../services/userServices.js');
const { httpResponseMessage } = require('../utils/responseMessages.js');
const logger = require('../utils/logger');

async function updateUser(req, res) {
  const { id } = req.params;
  const body = req.body;

  await patchUser(id, body)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      logger.error('error', err);
      res.status(500).send(httpResponseMessage[500]);
    });
}

async function resetUserPassword(req, res) {
  const body = req.body;

  await sendPasswordReset(body)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      logger.error('error', err);
      res.status(500).send(httpResponseMessage[500]);
    });
}

module.exports = { updateUser, resetUserPassword };
