const router = require('express').Router({ mergeParams: true });
const { readEvents, readEventById, readEventOrganizer } = require('../../controllers/eventController');

router.get('', readEvents);
router.get('/:id', readEventById);
router.get('/:id/organizer', readEventOrganizer);

module.exports = router;
