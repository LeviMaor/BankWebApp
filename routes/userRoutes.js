const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/profile', authenticateToken, userController.getProfile);
router.patch('/update', authenticateToken, userController.updateUser);

module.exports = router;
