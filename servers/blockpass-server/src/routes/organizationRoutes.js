'use strict';
const router = require('express').Router();
const { updateOrganization, readOrganization } = require('../controllers/organizationController.js');
const { readEvents, updateEvents, updateEventImages } = require('../controllers/eventController');
const {
  createTicketTier,
  readTicketTiers,
  readTicketTier,
  readTicketTierOwners,
} = require('../controllers/ticketTierController');
const {
  readEnhancements,
  createEnhancement,
  updateEnhancement,
  removeEnhancement,
} = require('../controllers/enhancementsController');
const { checkOrganizationId } = require('../middlewares/organizationMiddlewares.js');
const {
  checkReadPermission,
  checkUpdatePermission,
  checkCreatePermission,
  checkDeletePermission,
} = require('../middlewares/permissionMiddleware.js');
const { multer, uploadImageToBucket, removeImageFromBucket } = require('../middlewares/imageUploadMiddleware');

router.get('/:id', checkOrganizationId, checkReadPermission('organizations'), readOrganization);
router.patch('/:id', checkOrganizationId, checkUpdatePermission('organizations'), updateOrganization);

// Events
router.get('/:id/events', checkOrganizationId, checkReadPermission('events'), readEvents);
router.post(
  '/:id/events',
  checkOrganizationId,
  checkCreatePermission('events'),
  multer.any('images'),
  uploadImagesToBucket,
  createEvent
);
router.patch('/:id/events/:eventId', checkOrganizationId, checkUpdatePermission('events'), updateEvents);
router.patch(
  '/:id/events/:eventId/images',
  checkOrganizationId,
  checkUpdatePermission('events'),
  multer.any('images'),
  uploadImagesToBucket,
  removeImagesFromBucket,
  updateEventImages
);

// Ticket Tiers

router.post(
  '/:id/events/:eventId/ticket-tiers',
  checkOrganizationId,
  checkCreatePermission('ticket-tiers'),
  createTicketTier
);

router.get(
  '/:id/events/:eventId/ticket-tiers',
  checkOrganizationId,
  checkReadPermission('ticket-tiers'),
  readTicketTiers
);

router.get(
  '/:id/events/:eventId/ticket-tiers/:ticketTierId',
  checkOrganizationId,
  checkReadPermission('ticket-tiers'),
  readTicketTier
);

router.get(
  '/:id/events/:eventId/ticket-tiers/:ticketTierId/owners',
  checkOrganizationId,
  checkReadPermission('ticket-tiers'),
  readTicketTierOwners
);

// Enhancements
router.get(
  '/:id/events/:eventId/ticket-tiers/:ticketTierId/enhancements',
  checkOrganizationId,
  checkReadPermission('enhancements'),
  readEnhancements
);

router.post(
  '/:id/events/:eventId/ticket-tiers/:ticketTierId/enhancements',
  checkOrganizationId,
  checkCreatePermission('enhancements'),
  createEnhancement
);

router.patch(
  '/:id/events/:eventId/ticket-tiers/:ticketTierId/enhancements/:enhancementId',
  checkOrganizationId,
  checkUpdatePermission('enhancements'),
  updateEnhancement
);

router.delete(
  '/:id/events/:eventId/ticket-tiers/:ticketTierId/enhancements/:enhancementId',
  checkOrganizationId,
  checkDeletePermission('enhancements'),
  removeEnhancement
);

module.exports = router;
