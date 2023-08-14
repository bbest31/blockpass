const router = require('express').Router({ mergeParams: true });
const { readTicketTier } = require('../../controllers/ticketTierController');

router.get('/:ticketTierId', readTicketTier);

module.exports = router;
