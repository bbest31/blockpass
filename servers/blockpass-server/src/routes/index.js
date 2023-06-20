const router = require('express').Router();
const organizationRoutes = require('./organizationRoutes');
const userRoutes = require('./userRoutes');

router.use('/organizations', organizationRoutes);
router.use('/users', userRoutes);

module.exports = router;