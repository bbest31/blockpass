const router = require('express').Router({ mergeParams: true });
const {
  createTicketTier,
  readTicketTiers,
  readTicketTier,
  readTicketTierOwners,
  readTicketTierStats,
} = require('../controllers/ticketTierController');
const { checkReadPermission, checkCreatePermission } = require('../middlewares/permissionMiddleware.js');
const enhancementRoutes = require('./enhancementRoutes');

router.post('', checkCreatePermission('ticket-tiers'), createTicketTier);

router.get('', checkReadPermission('ticket-tiers'), readTicketTiers);

router.get('/:ticketTierId', checkReadPermission('ticket-tiers'), readTicketTier);

router.get('/:ticketTierId/owners', checkReadPermission('ticket-tiers'), readTicketTierOwners);

router.get('/:ticketTierId/stats', checkReadPermission('ticket-tiers'), readTicketTierStats);

router.use('/:ticketTierId/enhancements', enhancementRoutes);

module.exports = router;
