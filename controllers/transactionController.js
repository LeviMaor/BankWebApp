const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Get all transactions for the logged-in user
const getTransactions = asyncHandler(async (req, res) => {
    const user = req.user;

    const transactions = await Transaction.find({
        $or: [{ senderEmail: user.email }, { recipientEmail: user.email }]
    }).exec();

    if (!transactions) {
        return res.status(404).json({ message: 'No transactions found' });
    }

    res.json({ transactions });
});

// Create a new transaction
const createTransaction = asyncHandler(async (req, res) => {
    const { recipientEmail, amount } = req.body;
    const user = req.user;

    if (!recipientEmail || !amount) {
        return res.status(400).json({ message: 'Recipient email and amount are required' });
    }

    if (amount <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than zero' });
    }

    const sender = await User.findOne({ email: user.email }).exec();
    const recipient = await User.findOne({ email: recipientEmail }).exec();

    if (!recipient) {
        return res.status(404).json({ message: 'Recipient not found' });
    }

    if (sender.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
    }

    sender.balance -= amount;
    recipient.balance += amount;

    await sender.save();
    await recipient.save();

    const newTransaction = await Transaction.create({
        senderEmail: user.email,
        recipientEmail,
        amount
    });

    res.json({ message: 'Transaction successful', transaction: newTransaction });
});

// Deposit funds
const deposit = asyncHandler(async (req, res) => {
    const { amount } = req.body;
    const user = req.user;

    if (amount <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than zero' });
    }

    user.balance += amount;
    await user.save();

    res.json({ message: 'Deposit successful', newBalance: user.balance });
});

// Withdraw funds
const withdraw = asyncHandler(async (req, res) => {
    const { amount } = req.body;
    const user = req.user;

    if (amount <= 0 || user.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.balance -= amount;
    await user.save();

    res.json({ message: 'Withdrawal successful', newBalance: user.balance });
});

// Get transactions by user ID (admin route)
const getTransactionsByUserId = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Retrieve transactions for the specified user
    const transactions = await Transaction.find({
        $or: [{ senderEmail: user.email }, { recipientEmail: user.email }]
    }).exec();

    if (!transactions) {
        return res.status(404).json({ message: 'No transactions found for this user' });
    }

    res.json({ transactions });
});

module.exports = {
    getTransactions,
    createTransaction,
    deposit,
    withdraw,
    getTransactionsByUserId
};
