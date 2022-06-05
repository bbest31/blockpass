'use strict';
const router = require('express').Router();
const { getEvents } = require('../controllers/organizationController.js');
const { checkReadPermission, checkOrganizationId } = require('../middlewares/organizationMiddlewares.js');

router.get('/:id/events', checkOrganizationId, checkReadPermission, getEvents);

module.exports = router;
