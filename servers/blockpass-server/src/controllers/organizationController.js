'use strict';
const { getOrganizationEvents, patchOrganization } = require('../services/organizationServices.js');
const { httpResponseMessage } = require('../utils/responseMessages.js');

// Organizations

async function updateOrganization(req, res) {
  const { id } = req.params;
  const body = req.body;

  await patchOrganization(id, body)
    .then((org) => {
      res.status(200).send(org);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(httpResponseMessage[500]);
    });
}

// Events

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

module.exports = { getEvents, updateOrganization };
