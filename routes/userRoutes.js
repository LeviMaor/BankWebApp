const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateUser,
    getUser,
    getAllUsers,
    deleteUser
} = require('../controllers/userController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyUser = require('../middleware/verifyUser');

// User-specific routes
router.get('/profile', verifyJWT, getProfile);
router.patch('/update', verifyJWT, verifyUser, updateUser);

// Admin-specific routes
router.get('/all', verifyJWT,verifyAdmin, getAllUsers);
router.get('/:id', verifyJWT, verifyAdmin, getUser);
router.delete('/:id', verifyJWT, verifyAdmin, deleteUser);

module.exports = router;
