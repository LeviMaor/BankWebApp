const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const signup = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password ) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        email,
        password: hashedPassword,
        balance: 1000
    });

    res.status(201).json({ message: 'User created successfully', userId: newUser._id });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const accessToken = jwt.sign(
        { UserInfo: { email: user.email } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken });
});

const logout = (req, res) => {
    // const token = req.cookies.jwt;
    // tokenBlacklist.add(token);  // Add the token to the blacklist
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.json({ message: 'Logged out' });
};

module.exports = { signup, login, logout };
