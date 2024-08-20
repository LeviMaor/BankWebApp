const User = require('../models/User');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');

const getProfile = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const userData = await User.findOne({ email: user.email }).exec();
    if (!userData) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({
        email: userData.email,
        balance: userData.balance
    });
});

const updateUser = asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ email: user.email }, { password: hashedPassword });
    }

    res.json({ message: 'User updated successfully' });
});

module.exports = { getProfile, updateUser };
