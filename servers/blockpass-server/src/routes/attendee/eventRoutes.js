const router = require('express').Router();
const { readEvents, readEventById } = require('../../controllers/eventController');

router.get('', readEvents);
router.get('/:id', readEventById);

module.exports = router;
