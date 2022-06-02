'use strict';
const router = require('express').Router();
const { getEvents } = require('../controllers/organizationController.js');

router.get('/:id/events', getEvents);

module.exports = router;
