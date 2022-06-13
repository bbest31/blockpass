'use strict';
const { patchUser } = require('../services/userServices.js');
const { httpResponseMessage } = require('../utils/responseMessages.js');

async function updateUser(req, res) {
  const { id } = req.params;
  const body = req.body;

  await patchUser(id, body)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(httpResponseMessage[500]);
    });
}

module.exports = { updateUser };
