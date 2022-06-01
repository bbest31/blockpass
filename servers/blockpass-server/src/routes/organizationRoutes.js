'use strict';
const router = require('express').Router();
const { getEvents } = require('../controllers/organizationController.js');

router.get('/events', getEvents);

module.exports = router;
