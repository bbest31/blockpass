'use strict';
const { patchUser, sendPasswordReset } = require('../services/userServices.js');

async function updateUser(req, res, next) {
  const { id } = req.params;
  const body = req.body;

  await patchUser(id, body)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
}

async function resetUserPassword(req, res, next) {
  const body = req.body;

  await sendPasswordReset(body)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { updateUser, resetUserPassword };
