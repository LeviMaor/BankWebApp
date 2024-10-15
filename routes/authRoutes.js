const express = require('express');
const router = express.Router();
const { signup, signupAdmin, signupAdminWithKey, login, logout } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/signup-admin', signupAdminWithKey);
router.post('/admin-signup', signupAdmin);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
