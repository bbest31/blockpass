const router = require('express').Router();
const organizationRoutes = require('./organizationRoutes');
const userRoutes = require('./userRoutes');
const attendeeEventRoutes = require('./attendee/eventRoutes');
const { validateApiKey } = require('../middlewares/validateApiKey');

router.use('/organizations', organizationRoutes);
router.use('/users', userRoutes);
router.use('/events', validateApiKey, attendeeEventRoutes);

module.exports = router;
