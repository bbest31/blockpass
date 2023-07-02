const router = require('express').Router();
const { readEvents } = require('../../controllers/eventController');

router.get('', readEvents);

module.exports = router;
