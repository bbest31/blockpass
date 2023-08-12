const router = require('express').Router();
const organizationRoutes = require('./organizationRoutes');
const userRoutes = require('./userRoutes');
const attendeeEventRoutes = require('./attendee/eventRoutes');
const attendeeTicketTierRoutes = require('./attendee/ticketTierRoutes');
const { validateApiKey } = require('../middlewares/validateApiKey');

router.use('/organizations', organizationRoutes);
router.use('/users', userRoutes);
router.use('/events', validateApiKey, attendeeEventRoutes);
router.use('/ticket-tiers', validateApiKey, attendeeTicketTierRoutes);

module.exports = router;
