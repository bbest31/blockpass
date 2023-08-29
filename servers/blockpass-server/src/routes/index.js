const router = require('express').Router();
const organizationRoutes = require('./organizationRoutes');
const userRoutes = require('./userRoutes');
const marketplaceEventRoutes = require('./marketplace/eventRoutes');
const marketplaceTicketTierRoutes = require('./marketplace/ticketTierRoutes');
const attendeeTicketRoutes = require('./attendee/ticketRoutes');
const { validateApiKey } = require('../middlewares/validateApiKey');

router.use('/organizations', organizationRoutes);
router.use('/users', userRoutes);
router.use('/attendees', attendeeTicketRoutes);
router.use('/events', validateApiKey, marketplaceEventRoutes);
router.use('/ticket-tiers', validateApiKey, marketplaceTicketTierRoutes);

module.exports = router;
