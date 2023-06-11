'use strict';
const { getOrganization, patchOrganization } = require('../services/organizationServices.js');

async function readOrganization(req, res, next) {
  const { id } = req.params;

  await getOrganization(id)
    .then((org) => {
      res.status(200).send(org);
    })
    .catch((err) => {
      next(err);
    });
}

async function updateOrganization(req, res, next) {
  const { id } = req.params;
  const body = req.body;

  await patchOrganization(id, body)
    .then((org) => {
      res.status(200).send(org);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  updateOrganization,
  readOrganization,
};
