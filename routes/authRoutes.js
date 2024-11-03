const express = require('express');
const router = express.Router();
const signupLimiter = require('../middleware/signupLimiter');
const loginLimiter = require('../middleware/loginLimiter');
const { signup, signupWithoutCode, verifyEmail, signupAdmin, signupAdminWithKey, login, logout, forgotPassword, verifyResetCode, resetPassword } = require('../controllers/authController');

router.post('/signup', signupLimiter, signup);
router.post('/signup-without-code', signupWithoutCode);
router.post('/signup-admin', signupAdminWithKey);
router.post('/admin-signup', signupAdmin);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);


module.exports = router;
