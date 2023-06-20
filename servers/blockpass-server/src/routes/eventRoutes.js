const router = require('express').Router();
const { readEvents, updateEvents, updateEventImages, createEvent } = require('../controllers/eventController');
const { checkOrganizationId } = require('../middlewares/organizationMiddlewares.js');
const {
  checkReadPermission,
  checkUpdatePermission,
  checkCreatePermission,
} = require('../middlewares/permissionMiddleware.js');
const { multer, uploadImagesToBucket, removeImagesFromBucket } = require('../middlewares/imageUploadMiddleware');
const ticketTierRoutes = require('./ticketTierRoutes');

router.get('', checkOrganizationId, checkReadPermission('events'), readEvents);

router.post(
  '',
  checkOrganizationId,
  checkCreatePermission('events'),
  multer.any('images'),
  uploadImagesToBucket,
  createEvent
);

router.patch('/:eventId', checkOrganizationId, checkUpdatePermission('events'), updateEvents);

router.patch(
  '/:eventId/images',
  checkOrganizationId,
  checkUpdatePermission('events'),
  multer.any('images'),
  uploadImagesToBucket,
  removeImagesFromBucket,
  updateEventImages
);

router.use('/:eventId/ticket-tiers', ticketTierRoutes);

module.exports = router;
