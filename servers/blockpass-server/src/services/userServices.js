'use strict';
const { managementAPI } = require('../apis/auth0Api.js');

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

module.exports = {
  patchUser,
};
