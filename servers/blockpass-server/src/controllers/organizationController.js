'use strict';
const { getOrganizationEvents, getOrganization, patchOrganization } = require('../services/organizationServices.js');
const { httpResponseMessage } = require('../utils/responseMessages.js');

// Organizations

async function readOrganization(req, res) {
  const { id } = req.params;

  await getOrganization(id)
    .then((org) => {
      res.status(200).send(org);
    })
    .catch((err) => {
      console.error(err);
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
      console.error(err);
      res.status(500).send(httpResponseMessage[500]);
    });
}

// Events

async function readEvents(req, res) {
  const { id } = req.params;

  await getOrganizationEvents(id)
    .then((events) => {
      res.status(200).send(events);
    })
    .catch((err) => {
      res.status(500).send(httpResponseMessage[500]);
    });
}

module.exports = { readEvents, updateOrganization, readOrganization };
