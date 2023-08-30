const router = require('express').Router({ mergeParams: true });
const cors = require('cors');
const { readUserTickets } = require('../../controllers/ticketController');
const { checkAttendeeJWT } = require('../../middlewares/attendeeAuthenticate');

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3030',
  credentials: true,
};

router.get('/:wallet/tickets', cors(corsOptions), checkAttendeeJWT, readUserTickets);

module.exports = router;
