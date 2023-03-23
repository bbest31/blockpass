'use strict';
const router = require('express').Router();
const { updateUser, resetUserPassword } = require('../controllers/userController');
const { checkUserId } = require('../middlewares/userMiddlwares');
const { checkUpdatePermission } = require('../middlewares/permissionMiddleware');

router.patch('/:id', checkUserId, checkUpdatePermission('users'), updateUser);
router.post('/:id/change-password', checkUserId, checkUpdatePermission('users'), resetUserPassword);

module.exports = router;
