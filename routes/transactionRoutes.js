const express = require('express');
const router = express.Router();
const {
    getTransactions,
    createTransaction,
    deposit,
    withdraw,
    getTransactionsByUserId
} = require('../controllers/transactionController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyUser = require('../middleware/verifyUser');

// User-specific routes
router.get('/', verifyJWT, verifyUser, getTransactions);
router.post('/new', verifyJWT, verifyUser, createTransaction);
router.post('/deposit', verifyJWT, deposit);
router.post('/withdraw', verifyJWT, withdraw);

// Admin-specific route
router.get('/user/:id', verifyJWT, verifyAdmin, getTransactionsByUserId);

module.exports = router;
