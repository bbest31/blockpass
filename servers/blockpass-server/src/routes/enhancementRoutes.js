const router = require('express').Router();
const {
  readEnhancements,
  createEnhancement,
  updateEnhancement,
  removeEnhancement,
} = require('../controllers/enhancementsController');
const { checkOrganizationId } = require('../middlewares/organizationMiddlewares.js');
const {
  checkReadPermission,
  checkUpdatePermission,
  checkCreatePermission,
  checkDeletePermission,
} = require('../middlewares/permissionMiddleware.js');

// Enhancements
router.get(
  '',
  checkOrganizationId,
  checkReadPermission('enhancements'),
  readEnhancements
);

router.post(
  '',
  checkOrganizationId,
  checkCreatePermission('enhancements'),
  createEnhancement
);

router.patch(
  '/:enhancementId',
  checkOrganizationId,
  checkUpdatePermission('enhancements'),
  updateEnhancement
);

router.delete(
  '/:enhancementId',
  checkOrganizationId,
  checkDeletePermission('enhancements'),
  removeEnhancement
);

module.exports = router;