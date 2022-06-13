'use strict';
const router = require('express').Router();
const { getEvents, updateOrganization } = require('../controllers/organizationController.js');
const { checkOrganizationId } = require('../middlewares/organizationMiddlewares.js');
const { checkReadPermission, checkUpdatePermission } = require('../middlewares/permissionMiddleware.js');

router.patch('/:id', checkOrganizationId, checkUpdatePermission('organizations'), updateOrganization);
router.get('/:id/events', checkOrganizationId, checkReadPermission('events'), getEvents);

module.exports = router;
