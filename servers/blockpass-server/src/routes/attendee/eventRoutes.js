const router = require('express').Router({ mergeParams: true });
const { readEvents, readEventById } = require('../../controllers/eventController');

router.get('', readEvents);
router.get('/:id', readEventById);

module.exports = router;
