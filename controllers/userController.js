const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcrypt');

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
        balance: userData.balance,
        roles: user.roles
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

const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({
        email: user.email,
        balance: user.balance,
        roles: user.roles
    });
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').exec();
    res.status(200).json({ users });
});


const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id).exec();
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
});

module.exports = { getProfile, updateUser, getUser, getAllUsers, deleteUser };

