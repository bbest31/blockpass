const { Storage } = require('@google-cloud/storage');
const GCLOUD_CONFIG = require('../configs/gcloudConfig');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');
const { format } = require('util');

const bucketName = GCLOUD_CONFIG.BUCKET_NAME;

const gcpStorage = new Storage({
  projectId: GCLOUD_CONFIG.PROJECT_ID,
  credentials: {
    type: 'service_account',
    private_key: GCLOUD_CONFIG.PRIVATE_KEY,
    client_email: GCLOUD_CONFIG.CLIENT_EMAIL,
  },
});

/**
 * Upload multiple objects to a GCP bucket.
 * @param {Array} objects
 */
async function uploadObjects(objects) {
  let counter = 0;
  let objectUrls = [];

  const bucket = gcpStorage.bucket(bucketName);

  objects.forEach((obj) => {
    const id = uuidv4(); // use uuid for file name
    const ext = mime.extension(obj.mimetype); // determine file type extension

    const blob = bucket.file(`${id}.${ext}`);
    const blobStream = blob.createWriteStream();
    blobStream.on('error', (err) => {
      throw err;
    });

    const objectUrl = format(`https://storage.googleapis.com/${bucketName}/${blob.name}`);
    counter++;
    objectUrls.push(objectUrl);

    blobStream.on('finish', () => {
      console.log(`${id}.${ext} uploaded to ${bucketName}`);
    });

    blobStream.end(obj.buffer);
  });

  return objectUrls;
}

/**
 * Given an array of storage object names remove each from the GCP bucket.
 * @param {Array<string>} objects
 * @returns {Array<string>}
 */
async function removeObjects(objects) {
  const removedObjects = [];
  for (const obj of objects) {
    const name = obj.replace(`https://storage.googleapis.com/${bucketName}/`, '');

    try {
      await gcpStorage.bucket(bucketName).file(name).delete();
      removedObjects.push(obj);
    } catch (err) {
      throw err;
    }

    return removedObjects;
  }
}

module.exports = { removeObjects, uploadObjects, gcpStorage };
