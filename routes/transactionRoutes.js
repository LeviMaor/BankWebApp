const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, transactionController.getTransactions);
router.post('/deposit', authenticateToken, transactionController.deposit);
router.post('/withdraw', authenticateToken, transactionController.withdraw);
router.post('/new', authenticateToken, transactionController.createTransaction);

module.exports = router;
