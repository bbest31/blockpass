'use strict';
const { managementAPI } = require('../apis/auth0Api.js');

const USER_ATTRIBUTES = ['email', 'name'];

async function patchUser(userId, payload) {
  const user = { id: userId, payload: payload };
  // search for disallowed payload attributes
  Object.keys(payload).forEach((key) => {
    if (!USER_ATTRIBUTES.includes(key)) {
      throw new Error('user attribute not allowed to be updated');
    }
  });

    //TODO: if updating email send verify email address 
  return managementAPI.updateUser({ id: userId }, payload);
}

module.exports = {
  patchUser,
};
