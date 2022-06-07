'use strict';
const router = require('express').Router();
const { getEvents } = require('../controllers/organizationController.js');
const { checkOrganizationId } = require('../middlewares/organizationMiddlewares.js');
const checkPermission = require('../middlewares/permissionMiddleware.js');

const checkReadPermission = checkPermission('read', 'events');

router.get('/:id/events', checkOrganizationId, checkReadPermission, getEvents);

module.exports = router;
