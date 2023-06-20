const router = require('express').Router();
const {
  createTicketTier,
  readTicketTiers,
  readTicketTier,
  readTicketTierOwners,
} = require('../controllers/ticketTierController');
const { checkOrganizationId } = require('../middlewares/organizationMiddlewares.js');
const { checkReadPermission, checkCreatePermission } = require('../middlewares/permissionMiddleware.js');
const enhancementRoutes = require('./enhancementRoutes');

router.post('', checkOrganizationId, checkCreatePermission('ticket-tiers'), createTicketTier);

router.get('', checkOrganizationId, checkReadPermission('ticket-tiers'), readTicketTiers);

router.get('/:ticketTierId', checkOrganizationId, checkReadPermission('ticket-tiers'), readTicketTier);

router.get('/:ticketTierId/owners', checkOrganizationId, checkReadPermission('ticket-tiers'), readTicketTierOwners);

router.use('/:ticketTierId/enhancements', enhancementRoutes);

module.exports = router;
