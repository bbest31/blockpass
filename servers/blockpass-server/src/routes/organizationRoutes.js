'use strict';
const router = require('express').Router();
const {
  readEvents,
  updateOrganization,
  readOrganization,
  updateEvents,
  updateEventImages,
  getOrganizationEventTicketTiers
} = require('../controllers/organizationController.js');
const { checkOrganizationId } = require('../middlewares/organizationMiddlewares.js');
const { checkReadPermission, checkUpdatePermission } = require('../middlewares/permissionMiddleware.js');
const { multer, uploadImageToBucket, removeImageFromBucket } = require('../middlewares/imageUploadMiddleware');

router.get('/:id', checkOrganizationId, checkReadPermission('organizations'), readOrganization);
router.patch('/:id', checkOrganizationId, checkUpdatePermission('organizations'), updateOrganization);
router.get('/:id/events', checkOrganizationId, checkReadPermission('events'), readEvents);
router.patch('/:id/events/:eventId', checkOrganizationId, checkUpdatePermission('events'), updateEvents);
router.patch(
  '/:id/events/:eventId/images',
  checkOrganizationId,
  checkUpdatePermission('events'),
  multer.any('images'),
  uploadImageToBucket,
  removeImageFromBucket,
  updateEventImages
);
router.get('/:id/events/:eventId/ticket-tiers', checkOrganizationId, checkReadPermission('organizations'), getOrganizationEventTicketTiers);

module.exports = router;
