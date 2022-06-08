'use strict';
const router = require('express').Router();
const { getEvents } = require('../controllers/organizationController.js');
const { checkOrganizationId } = require('../middlewares/organizationMiddlewares.js');
const { checkReadPermission } = require('../middlewares/permissionMiddleware.js');

router.get('/:id/events', checkOrganizationId, checkReadPermission('events'), getEvents);

module.exports = router;
