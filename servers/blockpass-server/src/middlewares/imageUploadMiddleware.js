'use strict';
const Multer = require('multer');
const { removeObjects, uploadObjects } = require('../apis/gCloudApi');

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limits files to 5mb
  },
});

/**
 * This function will upload request files to GCP.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const uploadImagesToBucket = (req, res, next) => {
  if (req.files.length !== 0) {
    req.newImageUrls = uploadObjects(req.files);
  }
  next();
};

/**
 * This function will remove any files in the GCP bucket that are indicated within
 * a request body array `removedImages`.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const removeImagesFromBucket = async (req, res, next) => {
  if (!req.body.removedImages) {
    req.body.removedImages = removedImages;
    return next();
  }

  try {
    const removedImages = removeObjects(req.body.removedImages);
    req.body.removedImages = removedImages;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = { multer, uploadImagesToBucket, removeImagesFromBucket };
