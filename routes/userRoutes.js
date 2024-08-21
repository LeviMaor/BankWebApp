const express = require('express');
const router = express.Router();
const { getProfile, updateUser } = require('../controllers/userController');
const verifyJWT = require('../middleware/verifyJWT');

router.get('/profile', verifyJWT, getProfile);
router.patch('/update', verifyJWT, updateUser);

module.exports = router;
