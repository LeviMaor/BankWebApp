const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Get all transactions for the logged-in user
const getTransactions = asyncHandler(async (req, res) => {
    const user = req.user;

    const transactions = await Transaction.find({
        $or: [{ senderEmail: user.email }, { recipientEmail: user.email }]
    }).exec();

    if (!transactions || transactions.length === 0) {
        return res.status(404).json({ message: 'No transactions found' });
    }

    // Send transactions along with the date
    const formattedTransactions = transactions.map(transaction => ({
        senderEmail: transaction.senderEmail,
        recipientEmail: transaction.recipientEmail,
        amount: transaction.amount,
        date: transaction.createdAt
    }));

    res.json({ transactions: formattedTransactions });
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

        if (sender.balance < amount) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        sender.balance -= amount;
        recipient.balance += amount;

        await sender.save({ session });
        await recipient.save({ session });

        const newTransaction = await Transaction.create([{
            senderEmail: user.email,
            recipientEmail,
            amount
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

    if (!transactions || transactions.length === 0) {
        return res.status(404).json({ message: 'No transactions found for this user' });
    }

    // Send transactions along with the date
    const formattedTransactions = transactions.map(transaction => ({
        senderEmail: transaction.senderEmail,
        recipientEmail: transaction.recipientEmail,
        amount: transaction.amount,
        date: transaction.createdAt // Include the createdAt field
    }));

    res.json({ email: user.email, balance: user.balance, transactions: formattedTransactions });
});


module.exports = {
    getTransactions,
    createTransaction,
    deposit,
    withdraw,
    getTransactionsByUserId
};

