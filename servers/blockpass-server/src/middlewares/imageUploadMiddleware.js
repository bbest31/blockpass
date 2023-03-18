'use strict';
const { format } = require('util');
const Multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const GCLOUD_CONFIG = require('../configs/gcloudConfig');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');
const logger = require('../utils/logger');

const storage = new Storage({
  projectId: GCLOUD_CONFIG.PROJECT_ID,
  credentials: { client_email: GCLOUD_CONFIG.CLIENT_EMAIL, private_key: GCLOUD_CONFIG.PRIVATE_KEY },
});

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limits files to 5mb
  },
});

const bucket = storage.bucket(GCLOUD_CONFIG.BUCKET_NAME);

const uploadImageToBucket = (req, res, next) => {
  if (req.files.length === 0) {
    next();
  }

  let uploadCounter = 0;
  let imageUrls = [];

  req.files.forEach((image) => {
    const imageUuid = uuidv4();
    const imageExtension = mime.extension(image.mimetype);

    const blob = bucket.file(`${imageUuid}.${imageExtension}`);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {
      logger.error(err);
      next(err);
    });

    blobStream.on('finish', () => {
      const publicImageUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);

      uploadCounter++;
      imageUrls.push(publicImageUrl);

      if (uploadCounter >= req.files.length) {
        req.newImageUrls = imageUrls;
        next();
      }
    });

    blobStream.end(image.buffer);
  });
};

const removeImageFromBucket = async (req, res, next) => {
  const removedImages = [];

  if (!req.body.removedImages) {
    req.body.removedImages = removedImages;
    return next();
  }

  if (typeof req.body.removedImages === 'string') {
    const imageName = req.body.removedImages.replace(`https://storage.googleapis.com/${bucket.name}/`, '');
    try {
      await storage.bucket(bucket.name).file(imageName).delete();
      removedImages.push(req.body.removedImages);
    } catch (err) {
      logger.error('Unable to remove image from bucket', err);
    }

    req.body.removedImages = removedImages;
    return next();
  }

  for (const image of req.body.removedImages) {
    const imageName = image.replace(`https://storage.googleapis.com/${bucket.name}/`, '');

    try {
      await storage.bucket(bucket.name).file(imageName).delete();
      removedImages.push(image);
    } catch (err) {
      logger.error('Unable to remove image from bucket', err);
    }
  }
  req.body.removedImages = removedImages;
  return next();
};

module.exports = { multer, uploadImageToBucket, removeImageFromBucket };
