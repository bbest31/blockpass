'use strict';
const router = require('express').Router();
const {
  readEvents,
  updateOrganization,
  readOrganization,
  updateEvents,
  updateEventImages,
  readOrganizationEventTicketTiers,
  readTicketTier,
} = require('../controllers/organizationController.js');
const {
  readEnhancements,
  createEnhancement,
  updateEnhancement,
  removeEnhancement,
} = require('../controllers/enhancementsController');
const { checkOrganizationId } = require('../middlewares/organizationMiddlewares.js');
const { checkReadPermission, checkUpdatePermission } = require('../middlewares/permissionMiddleware.js');
const { multer, uploadImageToBucket, removeImageFromBucket } = require('../middlewares/imageUploadMiddleware');

router.get('/:id', checkOrganizationId, checkReadPermission('organizations'), readOrganization);
router.patch('/:id', checkOrganizationId, checkUpdatePermission('organizations'), updateOrganization);

// Events
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

// Ticket Tiers
router.get(
  '/:id/events/:eventId/ticket-tiers',
  checkOrganizationId,
  checkReadPermission('organizations'),
  readOrganizationEventTicketTiers
);
router.get(
  '/:id/events/:eventId/ticket-tiers/:ticketTierId',
  checkOrganizationId,
  checkReadPermission('organizations'),
  readTicketTier
);

// Enhancements
router.get(
  '/:id/events/:eventId/ticket-tiers/:ticketTierId/enhancements',
  checkOrganizationId,
  checkReadPermission('organizations'),
  readEnhancements
);

router.post(
  '/:id/events/:eventId/ticket-tiers/:ticketTierId/enhancements',
  checkOrganizationId,
  checkReadPermission('organizations'),
  createEnhancement
);

router.patch(
  '/:id/events/:eventId/ticket-tiers/:ticketTierId/enhancements/:enhancementId',
  checkOrganizationId,
  checkReadPermission('organizations'),
  updateEnhancement
);

router.delete(
  '/:id/events/:eventId/ticket-tiers/:ticketTierId/enhancements/:enhancementId',
  checkOrganizationId,
  checkReadPermission('organizations'),
  removeEnhancement
);

module.exports = router;
