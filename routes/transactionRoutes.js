const express = require('express');
const router = express.Router();
const {
    getTransactions,
    createTransaction,
    deposit,
    withdraw,
    getTransactionsByUserId
} = require('../controllers/transactionController');

const verifyAdmin = require('../middleware/verifyAdmin');
const verifyUser = require('../middleware/verifyUser');

// User-specific routes
router.get('/', verifyUser, getTransactions);
router.post('/new', verifyUser, createTransaction);
router.post('/deposit', deposit);
router.post('/withdraw', withdraw);

// Admin-specific route
router.get('/user/:id', verifyAdmin, getTransactionsByUserId);

module.exports = router;
