const router = require('express').Router({ mergeParams: true });
const { readUserTickets } = require('../../controllers/ticketController');
const { checkAttendeeJWT } = require('../../middlewares/attendeeAuthenticate');

router.get('/:wallet/tickets', checkAttendeeJWT, readUserTickets);

module.exports = router;
