const router = require('express').Router({ mergeParams: true });
const {
  readOrganizationEvents,
  updateEvents,
  updateEventImages,
  createEvent,
} = require('../controllers/eventController');
const {
  checkReadPermission,
  checkUpdatePermission,
  checkCreatePermission,
} = require('../middlewares/permissionMiddleware.js');
const { multer, uploadImagesToBucket, removeImagesFromBucket } = require('../middlewares/imageUploadMiddleware');
const ticketTierRoutes = require('./ticketTierRoutes');

router.get('', checkReadPermission('events'), readOrganizationEvents);

router.post('', checkCreatePermission('events'), multer.any('images'), uploadImagesToBucket, createEvent);

router.patch('/:eventId', checkUpdatePermission('events'), updateEvents);

router.patch(
  '/:eventId/images',
  checkUpdatePermission('events'),
  multer.any('images'),
  uploadImagesToBucket,
  removeImagesFromBucket,
  updateEventImages
);

router.use('/:eventId/ticket-tiers', ticketTierRoutes);

module.exports = router;
