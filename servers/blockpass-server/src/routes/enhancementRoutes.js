const router = require('express').Router({ mergeParams: true });
const {
  readEnhancements,
  createEnhancement,
  updateEnhancement,
  removeEnhancement,
} = require('../controllers/enhancementsController');
const {
  checkReadPermission,
  checkUpdatePermission,
  checkCreatePermission,
  checkDeletePermission,
} = require('../middlewares/permissionMiddleware.js');

// Enhancements
router.get('', checkReadPermission('enhancements'), readEnhancements);

router.post('', checkCreatePermission('enhancements'), createEnhancement);

router.patch('/:enhancementId', checkUpdatePermission('enhancements'), updateEnhancement);

router.delete('/:enhancementId', checkDeletePermission('enhancements'), removeEnhancement);

module.exports = router;
