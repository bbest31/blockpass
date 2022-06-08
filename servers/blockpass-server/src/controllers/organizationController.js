'use strict';
const { getOrganizationEvents } = require('../services/organizationServices.js');
const { httpResponseMessage } = require('../utils/responseMessages.js');

async function getEvents(req, res) {
  const { id } = req.params;

  await getOrganizationEvents(id)
    .then((events) => {
      res.status(200).send(events);
    })
    .catch((err) => {
      res.status(500).send(httpResponseMessage[500]);
    });
}

module.exports = { getEvents };
