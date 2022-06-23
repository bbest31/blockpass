'use strict';
const router = require('express').Router();
const { readEvents, updateOrganization, readOrganization } = require('../controllers/organizationController.js');
const { checkOrganizationId } = require('../middlewares/organizationMiddlewares.js');
const { checkReadPermission, checkUpdatePermission } = require('../middlewares/permissionMiddleware.js');

router.get('/:id', checkOrganizationId, checkReadPermission('organizations'), readOrganization);
router.patch('/:id', checkOrganizationId, checkUpdatePermission('organizations'), updateOrganization);
router.get('/:id/events', checkOrganizationId, checkReadPermission('events'), readEvents);

module.exports = router;
