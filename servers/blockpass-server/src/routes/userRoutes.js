'use strict';
const router = require('express').Router();
const { updateUser } = require('../controllers/userController');
const { checkUserId } = require('../middlewares/userMiddlwares');
const { checkUpdatePermission } = require('../middlewares/permissionMiddleware');

router.patch('/:id', checkUserId, checkUpdatePermission('users'), updateUser);

module.exports = router;
