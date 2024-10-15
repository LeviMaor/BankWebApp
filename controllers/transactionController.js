const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const mongoose = require('mongoose');

const getTransactions = asyncHandler(async (req, res) => {
    const user = req.user;

    const transactions = await Transaction.find({
        $or: [{ senderEmail: user.email }, { recipientEmail: user.email }]
    }).exec();

    if (!transactions || transactions.length === 0) {
        return res.status(404).json({ message: 'No transactions found' });
    }

    const formattedTransactions = transactions.map(transaction => ({
        senderEmail: transaction.senderEmail,
        recipientEmail: transaction.recipientEmail,
        amount: transaction.amount,
        date: transaction.createdAt
    }));

    res.json({ transactions: formattedTransactions });
});

const createTransaction = asyncHandler(async (req, res) => {
    const { recipientEmail, amount } = req.body;
    const user = req.user;

    if (!recipientEmail || !amount) {
        return res.status(400).json({ message: 'Recipient email and amount are required' });
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ message: 'Amount must be a valid number greater than zero' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const sender = await User.findOne({ email: user.email }).session(session).exec();
        const recipient = await User.findOne({ email: recipientEmail }).session(session).exec();

        if (!recipient) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Recipient not found' });
        }

        if (sender.balance < numericAmount) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        sender.balance -= numericAmount;
        recipient.balance += numericAmount;

        await sender.save({ session });
        await recipient.save({ session });

        const newTransaction = await Transaction.create([{
            senderEmail: user.email,
            recipientEmail,
            amount: numericAmount 
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Transaction successful', transaction: newTransaction });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: 'Transaction failed', error: error.message });
    }
});

const deposit = asyncHandler(async (req, res) => {
    const { amount } = req.body;
    const user = req.user;

    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ message: 'Amount must be a valid number greater than zero' });
    }

    user.balance += numericAmount;
    await user.save();

    res.json({ message: 'Deposit successful', newBalance: user.balance });
});

const withdraw = asyncHandler(async (req, res) => {
    const { amount } = req.body;
    const user = req.user;

    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0 || user.balance < numericAmount) {
        return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.balance -= numericAmount;
    await user.save();

    res.json({ message: 'Withdrawal successful', newBalance: user.balance });
});

const getTransactionsByUserId = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const transactions = await Transaction.find({
        $or: [{ senderEmail: user.email }, { recipientEmail: user.email }]
    }).exec();

    if (!transactions || transactions.length === 0) {
        return res.status(404).json({ message: 'No transactions found for this user' });
    }

    const formattedTransactions = transactions.map(transaction => ({
        senderEmail: transaction.senderEmail,
        recipientEmail: transaction.recipientEmail,
        amount: transaction.amount,
        date: transaction.createdAt 
    }));

    res.json({
        email: user.email,
        balance: user.balance,
        roles: user.roles, 
        transactions: formattedTransactions
    });
});

module.exports = {
    getTransactions,
    createTransaction,
    deposit,
    withdraw,
    getTransactionsByUserId
};
