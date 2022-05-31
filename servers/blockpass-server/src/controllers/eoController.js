'use strict';
const { getEoEvents } = require('../services/eoServices.js');
const { httpResponseMessage } = require('./responseMessages.js');

async function getEvents(req, res) {
  const { orgId } = req.body;

  await getEoEvents(orgId)
    .then((event) => {
      res.status(200).send(event);
    })
    .catch((err) => {
      res.status(500).send(httpResponseMessage[500]);
    });
}

module.exports = { getEvents };
