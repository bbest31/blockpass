'use strict';
const router = require('express').Router();
const { updateOrganization, readOrganization } = require('../controllers/organizationController.js');
const eventRoutes = require('./eventRoutes.js');
const { checkOrganizationId } = require('../middlewares/organizationMiddlewares.js');
const { checkReadPermission, checkUpdatePermission } = require('../middlewares/permissionMiddleware.js');

router.get('/:id', checkOrganizationId, checkReadPermission('organizations'), readOrganization);
router.patch('/:id', checkOrganizationId, checkUpdatePermission('organizations'), updateOrganization);

// Events
router.use('/:id/events', checkOrganizationId, eventRoutes);

module.exports = router;
