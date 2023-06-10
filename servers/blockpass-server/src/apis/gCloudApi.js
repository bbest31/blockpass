const { Storage } = require('@google-cloud/storage');
const GCLOUD_CONFIG = require('../configs/gcloudConfig');

const bucketName = GCLOUD_CONFIG.BUCKET_NAME;

const gcpStorage = new Storage({
  projectId: GCLOUD_CONFIG.PROJECT_ID,
  credentials: {
    type: 'service_account',
    private_key: GCLOUD_CONFIG.PRIVATE_KEY,
    client_email: GCLOUD_CONFIG.CLIENT_EMAIL,
  },
});

async function uploadFromMemory(content) {
  // TODO generate unique file name
  const destFileName = 'asd';
  await gcpStorage.bucket(bucketName).file(destFileName).save(contents);
}

module.exports = { uploadFromMemory, gcpStorage };
