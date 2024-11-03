const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateUser,
    getUser,
    getAllUsers,
    deleteUser
} = require('../controllers/userController');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyUser = require('../middleware/verifyUser');

router.get('/profile', getProfile);

// User-specific routes
router.patch('/update', verifyUser, updateUser);

// Admin-specific routes
router.get('/all', verifyAdmin, getAllUsers);
router.get('/:id', verifyAdmin, getUser);
router.delete('/:id', verifyAdmin, deleteUser);

module.exports = router;
