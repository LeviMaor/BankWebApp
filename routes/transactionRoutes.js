const express = require('express');
const router = express.Router();
const { getTransactions, createTransaction, deposit, withdraw } = require('../controllers/transactionController');
const verifyJWT = require('../middleware/verifyJWT');

router.get('/', verifyJWT, getTransactions);
router.post('/deposit', verifyJWT, deposit);
router.post('/withdraw', verifyJWT, withdraw);
router.post('/new', verifyJWT, createTransaction);

module.exports = router;
