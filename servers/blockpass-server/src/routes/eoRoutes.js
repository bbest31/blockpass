'use strict';
const router = require('express').Router();
const { getEvents } = require('../controllers/eoController.js');

router.get('/events', getEvents);

module.exports = router;
