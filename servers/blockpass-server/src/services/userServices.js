'use strict';
const { managementAPI, authenticationAPI } = require('../apis/auth0Api.js');
const { AUTH0_AUTHENTICATION_API } = require('../configs/auth0Config');

const USER_ATTRIBUTES = ['email', 'name'];

async function patchUser(userId, payload) {
  let updateEmail = false;
  // search for disallowed payload attributes
  Object.keys(payload).forEach((key) => {
    if (!USER_ATTRIBUTES.includes(key)) {
      throw new Error('user attribute not allowed to be updated');
    } else if (key === 'email') {
      updateEmail = true;
    }
  });

  const user = await managementAPI
    .updateUser({ id: userId }, payload)
    .then((userData) => {
      // if we are updating the user email, then we need to send a verification email to them.
      if (updateEmail) {
        managementAPI
          .sendEmailVerification({ user_id: userData.user_id })
          .then(() => {
            console.log(`Email verification sent to ${userData.email}`);
          })
          .catch((err) => {
            console.error('Error sending email verification email: ', err);
          });
      }
    })
    .catch((err) => {
      throw err;
    });

  return user;
}

async function sendPasswordReset(userId, payload) {
  const result = await authenticationAPI
    .requestChangePasswordEmail({
      email: payload.email,
      connection: payload.connection,
      client_id: AUTH0_AUTHENTICATION_API.clientId,
    })
    .catch((err) => {
      console.error('Error sending password reset email: ', err);
    });

  return result;
}

module.exports = {
  patchUser,
  sendPasswordReset,
};
