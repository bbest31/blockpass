'use strict';
const GCLOUD_CONFIG = {
  BUCKET_NAME: process.env.GCLOUD_BUCKET_NAME,
  PROJECT_ID: process.env.GCLOUD_PROJECT_ID,
  CLIENT_EMAIL: process.env.GCLOUD_CLIENT_EMAIL,
  PRIVATE_KEY: process.env.GCLOUD_PRIVATE_KEY,
};

module.exports = GCLOUD_CONFIG;
